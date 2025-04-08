const { customAlphabet } = require('nanoid');

// Generate a 6-character alphanumeric code (adjust alphabet/length as needed)
const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const nanoid = customAlphabet(alphabet, 6);

const generateShortCode = () => {
    return nanoid();
};

module.exports = generateShortCode;