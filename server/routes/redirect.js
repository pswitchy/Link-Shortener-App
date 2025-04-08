const express = require('express');
const { redirectLink } = require('../controllers/redirectController');
const router = express.Router();

// This route should be mounted at the root level in server.js
router.get('/:shortCode', redirectLink);

module.exports = router;