const mongoose = require('mongoose');
ObjectId = mongoose.Schema.ObjectId;

const Logs = new mongoose.Schema(
  {
    username: {
      type: Number,
      trim: true,
      maxlength: [50, 'username can not be more than 10 characters'],
    },
    message: {
      type: String,
      trim: true,
      maxlength: [100, 'Message can not be more than 100 characters'],
    },
    Date: {
      type: Date,
      default: Date,
    },
    updatedBy: { type: String },
    createdBy: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Logs', Logs, 'logs');
