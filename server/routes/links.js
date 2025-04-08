const express = require('express');
const { createLink, getLinks, getLinkAnalytics, updateLink, deleteLink} = require('../controllers/linkController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

// Apply protect middleware to all routes in this file
router.use(protect);

router.route('/')
    .post(createLink)
    .get(getLinks); // Handles pagination/search via query params

router.route('/:id')
    .put(updateLink)
    .delete(deleteLink);

router.route('/:id/analytics').get(getLinkAnalytics);

module.exports = router;