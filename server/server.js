const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const linkRoutes = require('./routes/links');
const redirectRoutes = require('./routes/redirect'); // Import redirect routes

// Load env vars
dotenv.config();

// Connect Database
connectDB();

const app = express();

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL, // Allow requests from frontend
}));
app.use(express.json()); // To parse JSON bodies

// Define API Routes
app.use('/api/auth', authRoutes);
app.use('/api/links', linkRoutes);

// Define Redirect Route (at the root level)
// IMPORTANT: This must come AFTER API routes if APIs also use root paths,
// but before any generic error handlers or static file serving if applicable.
app.use('/', redirectRoutes);

// Basic Error Handling (Example - can be more sophisticated)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));