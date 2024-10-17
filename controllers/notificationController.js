const Notification = require('../models/notification');
const Token = require('../models/token');
const admin = require('firebase-admin');

// Create a new notification
const createNotification = async (req, res, next) => {
  try {
    const title = req.body.title;
    const body = req.body.message;
    const externalLink = req.body.externalLink;
    if (!title || !body) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const tokens = await Token.find({ isActive: true }).select('token -_id');
    if (tokens.length > 0) {
      const tokensArray = tokens.map(token => token.token);
      // Prepare the message payload
      let data;
      if (externalLink) {
        data = {
          title: title,
          body: body,
          externalLink: externalLink,
        };
      } else {
        data = {
          title: title,
          body: body,
        };
      }
      const message = {
        notification: {
          title: title,
          body: body
        },
        data: data,
        tokens: tokensArray,
      };
      console.log('Message payload:', message);
      // Send notification to all tokens
      const response = await admin.messaging().sendEachForMulticast(message);

      return res.status(201).json({
        status: true,
        message: 'News created successfully and notification sent.',
      });
    }
  } catch (err) {
    console.error('Error sending notification', err);
    return res.status(500).json({
      "error": "Server error",
      "message": err?.message
    });
  }}

// Get notifications for the authenticated user
const getNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(notifications);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createNotification,
  getNotifications,
};
