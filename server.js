const express = require('express');
const mongoose = require('mongoose');
const admin = require('firebase-admin');
const bodyParser = require('body-parser');
const Token = require('./models/token');
const dotEnv = require('dotenv');
const isLoggedIn = require('./middlewares/isLoggedIn');
const {dbConnect} = require('./config/dbConnect.js')
const cookieParser = require('cookie-parser');
const path = require('path');
const cors = require('cors');

// Initialize Express app
const app = express();

dotEnv.config();
dbConnect();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static('public'));
app.use('/api/news', require('./routes/newsRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/prayers', require('./routes/prayerRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));




// Firebase Admin Initialization
// admin.initializeApp({
//     credential: admin.credential.applicationDefault(), 
// });



// Endpoint to save FCM token
// app.post('/api/tokens', async (req, res) => {
//     const { token, userId } = req.body;
//     try {
//         // Check if the token already exists
//         let existingToken = await Token.findOne({ token });
//         if (existingToken) {
//             return res.status(200).json({ message: 'Token already exists' });
//         }

//         // Save the new token
//         const newToken = new Token({ token, userId });
//         await newToken.save();
//         res.status(201).json({ message: 'Token saved successfully' });
//     } catch (error) {
//         console.error('Error saving token:', error);
//         res.status(500).json({ message: 'Error saving token' });
//     }
// });



app.get('/home' , isLoggedIn ,(req, res) => {
    res.render('home');
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.get('/add-news', isLoggedIn ,(req, res) => {
    res.render('addNews', { message: '' });
});

app.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.redirect('/login');
});

app.get('/add-admin', isLoggedIn ,(req, res)=>{
    res.render('addAdmin')
})

app.get('/news', isLoggedIn ,(req, res) => {
    res.render('news');
});

app.get('/prayers', isLoggedIn ,(req, res) => {
    res.render('allPrayers');
});

app.get('/add-prayer', isLoggedIn ,(req, res) => {
    res.render('addPrayer');
});

app.get('/prayers/:id', isLoggedIn ,(req, res) => {
    res.render('getPrayer');
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
