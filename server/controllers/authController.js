const User = require('../models/User');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    const { username, email, password } = req.body;

    // Basic validation
    if (!username || !email || !password) { // Add username check
        return res.status(400).json({ message: 'Please provide username, email, and password' });
    }
    // Optional: Add password strength validation here

    try {
        // Check if username OR email exists
        const usernameExists = await User.findOne({ username: username }); // Or use appropriate collation for case-insensitivity
        const emailExists = await User.findOne({ email: email.toLowerCase() });

        if (usernameExists) {
            return res.status(400).json({ message: 'Username already taken' });
        }
        if (emailExists) {
            return res.status(400).json({ message: 'User already exists with this email' });
        }

        const user = new User({
            username, // Add username
            email: email.toLowerCase(),
            password,
        });

        await user.save();

        // Return user info and token
        res.status(201).json({
            _id: user._id,
            username: user.username, // Include username in response
            email: user.email,
            token: jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
                expiresIn: '30d',
            }),
        });

    } catch (error) {
        // Check if it's the duplicate key error specifically
        if (error.code === 11000) {
             // Determine if it was username or email collision based on error message if possible
             // For simplicity, provide a generic message or inspect error.keyValue
            return res.status(400).json({ message: 'Username or Email already exists.' });
        }
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Server error during registration' });
    }
};


// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email: email.toLowerCase() });

        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                email: user.email,
                token: jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
                    expiresIn: '30d', // Token expiration
                }),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error during login' });
    }
};

// Export both functions
module.exports = { registerUser, loginUser };