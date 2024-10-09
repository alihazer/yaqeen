const express = require('express');
const { register, login } = require('../controllers/authController.js');
const router = express.Router();

// User registration
router.post('/register', register);

// User login
router.post('/login', (req, res, next)=>{
    console.log('login route');
    next();
} ,login);
module.exports = router;
