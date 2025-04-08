const mongoose = require('mongoose');

const ClickSchema = new mongoose.Schema({
    linkId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Link',
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
    ipAddress: {
        type: String,
    },
    userAgent: {
        type: String,
    },
    deviceType: {
        type: String, // e.g., 'desktop', 'mobile', 'tablet'
    },
    browser: {
        type: String, // e.g., 'Chrome', 'Firefox', 'Safari'
    },
    os: {
        type: String, // e.g., 'Windows', 'MacOS', 'Linux', 'iOS', 'Android'
    }
    // Add country, city later if using GeoIP
});

// Index for faster analytics queries
ClickSchema.index({ linkId: 1, timestamp: -1 });

module.exports = mongoose.model('Click', ClickSchema);