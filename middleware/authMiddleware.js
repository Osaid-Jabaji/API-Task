const jwt = require('jsonwebtoken');
const secretKey = 'your_jwt_secret_key';

const authMiddleware = (req, res, next) => {
    const token = req.headers.token;
    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }
    try {
        const decoded = jwt.verify(token, secretKey);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(400).json({ message: 'Invalid token.' });
    }
};

module.exports = authMiddleware;
