// Run this script once using `node utils/seedUser.js` after setting up db connection
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');
require('dotenv').config({ path: '../.env' }); // Adjust path if needed

const seedUser = async () => {
    await connectDB();

    try {
        // Clear existing users (optional, be careful in production)
        // await User.deleteMany({});

        const existingUser = await User.findOne({ email: 'intern@dacoid.com' });

        if (!existingUser) {
            const user = new User({
                email: 'intern@dacoid.com',
                password: 'Test123', // Password will be hashed by the pre-save hook
            });
            await user.save();
            console.log('Hardcoded user created!');
        } else {
            console.log('Hardcoded user already exists.');
        }

    } catch (error) {
        console.error('Error seeding user:', error);
    } finally {
        mongoose.connection.close();
    }
};

seedUser();