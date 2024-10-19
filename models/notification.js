const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  totalSent: {
    type: Number,
    default: 0,
  },
  totalDelivered: {
    type: Number,
    default: 0,
  },
  totalFailed: {
    type: Number,
    default: 0,
  },
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);
