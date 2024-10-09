const Notification = require('../models/notification');

// Create a new notification
const createNotification = async (req, res, next) => {
  try {
    const { title, message } = req.body;

    if (!title || !message) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const notification = new Notification({
      title,
      message,
      user: req.user._id,
    });

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
