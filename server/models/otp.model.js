const mongoose = require('mongoose');
ObjectId = mongoose.Schema.ObjectId;

const otpModel = new mongoose.Schema({
  contactNumber: String,
  loginOtp: String,
  active: Boolean,
  expiresOn: {
    type: Date,
    default: Date
  },
  updatedBy: { type: String },
  createdBy: { type: String },
},
  {timestamps: true}
);

module.exports = mongoose.model('otpModel', otpModel, 'loginOtp');


