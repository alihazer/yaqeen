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

    // Fetch all active tokens from the database
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

      // Send notification to all tokens
      const response = await admin.messaging().sendEachForMulticast(message);

      // Track invalid tokens
      const invalidTokens = [];
      response.responses.forEach((resp, index) => {
        if (resp.error) {
          const error = resp.error;
          // Collect invalid tokens based on error codes
          if (
            error.code === 'messaging/invalid-registration-token' ||
            error.code === 'messaging/registration-token-not-registered'
          ) {
            invalidTokens.push(tokensArray[index]);
          }
        }
      });

      // Check if there are more than 10 invalid tokens
      if (invalidTokens.length > 10) {
        console.log('Deleting invalid tokens:', invalidTokens);

        // Delete invalid tokens from the database
        await Token.deleteMany({ token: { $in: invalidTokens } });

        console.log(`${invalidTokens.length} invalid tokens were deleted.`);
      }

      // Save the notification record in the database
      const notification = new Notification({
        title,
        message: body,
        totalSent: tokens.length,
        totalDelivered: response.successCount,
        totalFailed: response.failureCount
      });

      await notification.save();

      return res.status(201).json({
        status: true,
        message: 'News created successfully and notification sent.',
      });
    } else {
      return res.status(404).json({
        status: false,
        message: 'No active tokens found.'
      });
    }
  } catch (err) {
    console.error('Error sending notification', err);
    return res.status(500).json({
      error: "Server error",
      message: err?.message
    });
  }
};


// Get notifications for the authenticated user
const getNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 });
    res.status(200).json({
      status: true,
      data: notifications,
    });
  } catch (err) {
    console.error('Error getting notifications', err);
    return res.status(500).json({
      "error": "Server error",
      "message": err?.message
    });
  }
};

module.exports = {
  createNotification,
  getNotifications,
};
