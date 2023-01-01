const mongoose = require('mongoose');

ObjectId = mongoose.Schema.ObjectId;

const RateConfig = new mongoose.Schema(
  {
    type: {
      type: String,
      required: [true, 'Please Enter Type'],
      trim: true,
      maxlength: [50, 'Type can not be more than 50 characters'],
    },
    pricePerKM: {
      type: Number,
      required: [true, 'Please Enter a Price Per KM'],
      trim: true,
      maxlength: [10, 'Price Per KM can not be more than 10 characters'],
    },
    slab: {
      type: String,
      required: [true, 'Please Enter Slab'],
      trim: true,
      maxlength: [50, 'Type can not be more than 50 characters'],
      default: 'default',
    },
    updatedBy: { type: String },
    createdBy: { type: String },
  },
  { timestamps: true }
);

RateConfig.index({ type: 1, slab: 1 }, { unique: true });

module.exports = mongoose.model('RateConfig', RateConfig, 'rateconfigs');
