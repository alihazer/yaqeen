const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotEnv = require('dotenv');
const {dbConnect} = require('./config/dbConnect.js')
const cookieParser = require('cookie-parser');
const serviceAccount = require('./config/serviceAccountKey.json');
const admin = require('firebase-admin');
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
app.use('/api/awar', require('./routes/AwarenessRoutes'));
app.use('/api/token', require('./routes/tokenRoutes.js'));

// EJS routes
app.use(require('./routes/ejsRoutes/ejs.routes'));
app.use('/images', express.static('images'));



admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});



// Not found route
app.get('*', (req, res) => {
    res.render('404');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
