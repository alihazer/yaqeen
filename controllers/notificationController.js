const Notification = require('../models/notification');
const Token = require('../models/token');
const admin = require('firebase-admin');

// Create a new notification
const createNotification = async (req, res, next) => {
  try {
    const { title, message } = req.body;

    if (!title || !message) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const notification = new Notification({
      title,
      message
    });

    // send notification to all active devices
    const tokens = await Token.find({ isActive: true }).select('token -_id');
    if (tokens.length > 0) {
      const tokensArray = tokens.map(token => token.token);

      const payload = {
        notification: {
          title,
          body: message,
        },
        data: {
          title,
          message
        },
        tokens: tokensArray,
      };

      await admin.messaging().sendEachForMulticast({ payload });
    }

    await notification.save();
    res.status(201).json(notification);
  } catch (err) {
    next(err);
  }
};

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
