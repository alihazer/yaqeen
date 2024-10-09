const express = require('express');
const { createNotification, getNotifications } = require('../controllers/notificationController');
const { protect } = require('../middlewares/authMiddleware');
const router = express.Router();

// Create a new notification (admin only)
router.post('/', protect, createNotification);

// Get notifications for the authenticated user
router.get('/', protect, getNotifications);

module.exports = router;
