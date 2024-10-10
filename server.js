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


const app = express();

dotEnv.config();
dbConnect();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static('public'));

// Api routes
app.use('/api/news', require('./routes/newsRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/prayers', require('./routes/prayerRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));

// EJS routes
app.use(require('./routes/ejsRoutes/ejs.routes'));




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

// Not found route
app.get('*', (req, res) => {
    res.render('404');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
