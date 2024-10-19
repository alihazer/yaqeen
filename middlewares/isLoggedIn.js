const jwt = require('jsonwebtoken');


module.exports = (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    if (!token) {
        if (req.headers['x-requested-with']) {
            return res.status(401).json({ message: 'Not authorized, no token' });
        }
        return res.redirect('/login');
    }
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; 
        next();
    }catch (error) {
        console.log('Error verifying token:', error);
        return res.status(401).json({ message: 'Token invalid or expired' });
    }
}