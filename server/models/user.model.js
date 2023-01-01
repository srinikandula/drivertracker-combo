const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    phonenumber: {
      type: Number,
      required: true,
      unique: true,
    },
    password: { type: String, required: true },
    updatedBy: { type: String },
    createdBy: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('users', UserSchema, 'users');
