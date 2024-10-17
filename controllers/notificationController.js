const Notification = require('../models/notification');
const Token = require('../models/token');
const admin = require('firebase-admin');

// Create a new notification
const createNotification = async (req, res, next) => {
  try {
    const title = req.body.title;
    const body = req.body.message;
    if (!title || !body) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const tokens = await Token.find({ isActive: true }).select('token -_id');
    if (tokens.length > 0) {
      const tokensArray = tokens.map(token => token.token);
      // Prepare the message payload
      const message = {
        notification: {
          title: title,
          body: body
        },
        data: {
          title: title,
        },
        tokens: tokensArray,
      };
      console.log('Message payload:', message);
      // Send notification to all tokens
      const response = await admin.messaging().sendEachForMulticast(message);
      console.log(response.responses)

      // Check for failures
      if (response.failureCount > 0) {
        response.responses.forEach((result, index) => {
          if (result.error) {
            console.error(`Error sending notification to ${tokensArray[index]}: ${result.error.message}`);
            console.error(`Error details: ${JSON.stringify(result.error, null, 2)}`);  // Log full error details
          }
        });
      }
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
