const jwt = require('jsonwebtoken');
require('dotenv').config();

// Function to generate a JWT token
exports.generateToken = (user) => {
    const payload = {
        username: user._id,
        email: user.email
    };
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
};

// Function to verify a JWT token
exports.verifyToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
        return null;
    }
};