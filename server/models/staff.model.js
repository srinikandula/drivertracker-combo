const mongoose = require('mongoose');
ObjectId = mongoose.Schema.ObjectId;

const staffModel = new mongoose.Schema({
    contactNumber: String,
    updatedBy: {type: String},
    createdBy: {type: String},
  },
  {timestamps: true}
);

module.exports = mongoose.model('staffModel', staffModel, 'staff');


