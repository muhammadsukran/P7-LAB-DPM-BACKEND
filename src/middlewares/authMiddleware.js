const jwt = require('jsonwebtoken');

const authMiddleware = async (req, res, next) => {
    const authHeader = req.header('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: 'No token provided, authorization denied' });
    }

    const token = authHeader.split(' ')[1]; // Ambil token setelah "Bearer"

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Pastikan payload token memiliki ID pengguna
        if (!decoded.id) {
            return res.status(401).json({ success: false, message: 'Invalid token payload' });
        }

        req.user = decoded; // Simpan user dari token ke `req.user`
        next();
    } catch (error) {
        console.error('Token verification failed:', error.message);

        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ success: false, message: 'Token expired' });
        }

        res.status(401).json({ success: false, message: 'Invalid token' });
    }
};

module.exports = authMiddleware;
