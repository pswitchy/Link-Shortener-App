const Link = require('../models/Link');
const Click = require('../models/Click');
const generateShortCode = require('../utils/generateShortCode');

// @desc    Create a new short link
// @route   POST /api/links
// @access  Private
const createLink = async (req, res) => {
    const { originalUrl, customAlias, expiresAt } = req.body;
    const userId = req.user._id; // From authMiddleware

    if (!originalUrl) {
        return res.status(400).json({ message: 'Original URL is required' });
    }

    // Basic URL validation (can be more sophisticated)
    try {
        new URL(originalUrl);
    } catch (error) {
        return res.status(400).json({ message: 'Invalid Original URL format' });
    }

    try {
        let shortCode = customAlias?.trim();
        let codeInUse = false;

        if (shortCode) {
            // Validate custom alias format (e.g., alphanumeric, no spaces)
            if (!/^[a-zA-Z0-9_-]+$/.test(shortCode)) {
                 return res.status(400).json({ message: 'Invalid custom alias format. Use only letters, numbers, underscores, hyphens.' });
            }
            // Check if custom alias already exists
            const existingLink = await Link.findOne({ shortCode });
            if (existingLink) {
                return res.status(400).json({ message: 'Custom alias already in use' });
            }
        } else {
            // Generate unique short code
            do {
                shortCode = generateShortCode();
                const existingLink = await Link.findOne({ shortCode });
                codeInUse = !!existingLink;
            } while (codeInUse);
        }

        const newLink = new Link({
            originalUrl,
            shortCode,
            userId,
            expiresAt: expiresAt ? new Date(expiresAt) : null,
        });

        const savedLink = await newLink.save();

        // Construct the full short URL to return to the client
        const fullShortUrl = `${req.protocol}://${req.get('host')}/${savedLink.shortCode}`;

        res.status(201).json({
            ...savedLink.toObject(),
             shortUrl: fullShortUrl // Add the full URL for convenience
        });

    } catch (error) {
        console.error('Error creating link:', error);
        if (error.code === 11000) { // Duplicate key error (safety net for race condition)
             res.status(400).json({ message: 'Alias or generated code conflict. Please try again.' });
        } else {
             res.status(500).json({ message: 'Server error creating link' });
        }
    }
};

// @desc    Get user's links with analytics summary and pagination
// @route   GET /api/links
// @access  Private
const getLinks = async (req, res) => {
    const userId = req.user._id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const searchQuery = req.query.search || '';
    const skip = (page - 1) * limit;

    try {
         // Build search query
        const queryFilter = { userId };
        if (searchQuery) {
            queryFilter.$or = [
                { originalUrl: { $regex: searchQuery, $options: 'i' } },
                { shortCode: { $regex: searchQuery, $options: 'i' } },
            ];
        }

        const links = await Link.find(queryFilter)
            .sort({ createdAt: -1 }) // Sort by newest first
            .skip(skip)
            .limit(limit)
            .lean(); // Use lean for performance as we modify the objects

        const totalLinks = await Link.countDocuments(queryFilter);

        // Fetch click counts for the retrieved links
        const linkIds = links.map(link => link._id);
        const clickCounts = await Click.aggregate([
            { $match: { linkId: { $in: linkIds } } },
            { $group: { _id: '$linkId', count: { $sum: 1 } } }
        ]);

        // Create a map for easy lookup
        const clickCountMap = clickCounts.reduce((acc, curr) => {
            acc[curr._id.toString()] = curr.count;
            return acc;
        }, {});

        // Add click count and full short URL to each link object
        const linksWithData = links.map(link => {
            const fullShortUrl = `${req.protocol}://${req.get('host')}/${link.shortCode}`;
            return {
                ...link,
                totalClicks: clickCountMap[link._id.toString()] || 0,
                shortUrl: fullShortUrl,
                // Determine expiration status (can be done on frontend too)
                isExpired: link.expiresAt && new Date(link.expiresAt) < new Date(),
            };
        });


        res.json({
            links: linksWithData,
            currentPage: page,
            totalPages: Math.ceil(totalLinks / limit),
            totalLinks,
        });

    } catch (error) {
        console.error('Error fetching links:', error);
        res.status(500).json({ message: 'Server error fetching links' });
    }
};

// @desc    Get detailed analytics for a specific link
// @route   GET /api/links/:id/analytics
// @access  Private
const getLinkAnalytics = async (req, res) => {
    const linkId = req.params.id;
    const userId = req.user._id; // Ensure user owns the link

    try {
        const link = await Link.findOne({ _id: linkId, userId });
        if (!link) {
            return res.status(404).json({ message: 'Link not found or access denied' });
        }

        const clicks = await Click.find({ linkId }).sort({ timestamp: 1 }); // Sort for time series

        // --- Data Aggregation ---

        // 1. Clicks over time (e.g., daily)
        const clicksByDate = clicks.reduce((acc, click) => {
            const date = click.timestamp.toISOString().split('T')[0]; // YYYY-MM-DD
            acc[date] = (acc[date] || 0) + 1;
            return acc;
        }, {});
        // Format for charts [{ date: 'YYYY-MM-DD', count: N }, ...]
         const clicksOverTime = Object.entries(clicksByDate)
            .map(([date, count]) => ({ date, count }))
            .sort((a, b) => new Date(a.date) - new Date(b.date)); // Ensure chronological order


        // 2. Device breakdown
        const deviceCounts = clicks.reduce((acc, click) => {
            const device = click.deviceType || 'Unknown';
            acc[device] = (acc[device] || 0) + 1;
            return acc;
        }, {});
        const deviceBreakdown = Object.entries(deviceCounts).map(([name, count]) => ({ name, count }));


        // 3. Browser breakdown
        const browserCounts = clicks.reduce((acc, click) => {
            const browser = click.browser || 'Unknown';
            acc[browser] = (acc[browser] || 0) + 1;
            return acc;
        }, {});
         const browserBreakdown = Object.entries(browserCounts).map(([name, count]) => ({ name, count }));

         // 4. OS breakdown
        const osCounts = clicks.reduce((acc, click) => {
            const os = click.os || 'Unknown';
            acc[os] = (acc[os] || 0) + 1;
            return acc;
        }, {});
         const osBreakdown = Object.entries(osCounts).map(([name, count]) => ({ name, count }));


        res.json({
            totalClicks: clicks.length,
            clicksOverTime,
            deviceBreakdown,
            browserBreakdown,
            osBreakdown
            // Add location breakdown here if implementing GeoIP
        });

    } catch (error) {
        console.error('Error fetching link analytics:', error);
        res.status(500).json({ message: 'Server error fetching analytics' });
    }
};


module.exports = { createLink, getLinks, getLinkAnalytics };