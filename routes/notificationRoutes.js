const express = require('express');
const { createNotification, getNotifications } = require('../controllers/notificationController');
const isLoggedIn = require('../middlewares/isLoggedIn.js');

const router = express.Router();

// Create a new notification (admin only)
router.post('/' ,createNotification);

// Get notifications for the authenticated user
router.get('/', getNotifications);

module.exports = router;
