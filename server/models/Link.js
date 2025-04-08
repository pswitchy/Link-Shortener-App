const mongoose = require('mongoose');

const LinkSchema = new mongoose.Schema({
    originalUrl: {
        type: String,
        required: true,
    },
    shortCode: {
        type: String,
        required: true,
        unique: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    expiresAt: {
        type: Date,
        default: null, // Null means no expiration
    },
    // We will get total clicks by querying the Click collection
});

// Optional: Create index for faster lookups by shortCode
LinkSchema.index({ shortCode: 1 });
// Optional: Create TTL index for automatic expiration (if desired)
// LinkSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // Requires expiresAt to be set

module.exports = mongoose.model('Link', LinkSchema);