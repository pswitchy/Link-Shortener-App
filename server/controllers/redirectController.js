const Link = require('../models/Link');
const Click = require('../models/Click');
const UAParser = require('ua-parser-js');

// @desc    Redirect short URL and log click asynchronously
// @route   GET /:shortCode
// @access  Public
const redirectLink = async (req, res) => {
    const { shortCode } = req.params;

    try {
        const link = await Link.findOne({ shortCode });

        if (!link) {
            return res.status(404).send('Link not found');
        }

        // Check for expiration
        if (link.expiresAt && new Date(link.expiresAt) < new Date()) {
            return res.status(410).send('Link has expired'); // 410 Gone
        }

        // --- Redirect Immediately ---
        res.redirect(302, link.originalUrl); // Use 302 for temporary redirect

        // --- Log Click Asynchronously (don't await before redirecting) ---
        try {
            const ipAddress = req.ip || req.connection.remoteAddress;
            const userAgentString = req.headers['user-agent'];
            const parser = new UAParser(userAgentString);
            const uaResult = parser.getResult();

            const clickData = {
                linkId: link._id,
                ipAddress,
                userAgent: userAgentString,
                deviceType: uaResult.device.type || 'desktop', // Default to desktop if undefined
                browser: uaResult.browser.name,
                os: uaResult.os.name,
                // Add GeoIP lookup here if needed (would likely be async)
            };

            const click = new Click(clickData);
            await click.save(); // Save to database
            // console.log('Click logged for:', shortCode); // Optional logging

        } catch (logError) {
             // Important: Log the error but don't crash the redirect
            console.error('Error logging click:', logError);
        }

    } catch (error) {
        console.error('Redirect error:', error);
        res.status(500).send('Server error');
    }
};

module.exports = { redirectLink };