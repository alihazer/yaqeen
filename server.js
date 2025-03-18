const express = require('express');
const bodyParser = require('body-parser');
const dotEnv = require('dotenv');
const {dbConnect} = require('./config/dbConnect.js')
const cookieParser = require('cookie-parser');
const admin = require('firebase-admin');
const path = require('path');
const generateSession = require('./utils/generateSession.js');
const startTelegramSync = require('./controllers/telegramSync.js');
const cors = require('cors');
const isLoggedIn = require('./middlewares/isLoggedIn.js');


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



app.use('/' ,require('./routes/ejsRoutes/ejs.routes.js'));

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

app.use('/images', express.static('images'));

const serviceAccount = {
    type: process.env.GOOGLE_PRIVATE_KEY_TYPE || "service_account",
    project_id: process.env.GOOGLE_PROJECT_ID,
    private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
    private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    client_id: process.env.GOOGLE_CLIENT_ID,
    auth_uri: process.env.GOOGLE_AUTH_URI,
    token_uri: process.env.GOOGLE_TOKEN_URI,
    auth_provider_x509_cert_url: process.env.GOOGLE_AUTH_PROVIDER_CERT_URL,
    client_x509_cert_url: process.env.GOOGLE_CLIENT_CERT_URL,
    universe_domain: process.env.GOOGLE_UNIVERSE_DOMAIN
};

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});
console.log('TELEGRAM CREDS', process.env.TELEGRAM_API_ID, process.env.TELEGRAM_API_HASH);
// generateSession();
// start telegram sync
startTelegramSync();



// Not found route
app.get('*', (req, res) => {
    res.render('404');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
