const User = require('../models/user');
const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );
};

// Register a new user
const register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    let role = req.body.role;

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    if(!role){
        role = 'admin'
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'Email already registered' });
    }
    const userNameExists = await User.findOne({ username });
    if(userNameExists){
      return res.status(400).json({ message: 'Username already registered' });
    }
    const newUser = new User({ username, email, password, role });
    await newUser.save();
    const token = generateToken(newUser);
    res.status(201).json({ token });
  } catch (err) {
    next(err);
  }
};

// Login user
const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    // Validate request body
    if (!username || !password) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }
    // Find user by email
    const user = await User.findOne({ username });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }
    // Generate JWT
    const token = generateToken(user);
    // Send token as an HttpOnly cookie
    res.cookie('token', token, {
      httpOnly: true,  // Prevents access by JavaScript
      secure: process.env.NODE_ENV === 'production', // Only send over HTTPS in production
      maxAge: 24 * 60 * 60 * 1000 // 1 day expiration
    });
    // Optionally, send user info to the frontend
    res.status(200).json({
      message: 'Login successful',
      user: {
        name: user.name,
        email: user.email,
        role: user.role, // Include role if needed for permissions
      }
    });
  } catch (err) {
    next(err);
  }
};


module.exports = {
  register,
  login,
};
