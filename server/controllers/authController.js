const User = require('../models/User');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    const { email, password } = req.body;

    // Basic validation
    if (!email || !password) {
        return res.status(400).json({ message: 'Please provide email and password' });
    }
    // Optional: Add password strength validation here

    try {
        const userExists = await User.findOne({ email: email.toLowerCase() });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists with this email' });
        }

        const user = new User({
            email: email.toLowerCase(),
            password, // Hashing is handled by the pre-save hook in User model
        });

        await user.save();

        // Return user info and token upon successful registration
        res.status(201).json({
            _id: user._id,
            email: user.email,
            token: jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
                expiresIn: '30d', // Consistent token expiration
            }),
        });

    } catch (error) {
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