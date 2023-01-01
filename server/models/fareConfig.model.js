const mongoose = require('mongoose');

ObjectId = mongoose.Schema.ObjectId;
const FareConfig = new mongoose.Schema(
  {
    sourcecity: {
      type: String,
      required: [true, 'Please Enter a Source City'],
      trim: true,
      maxlength: [50, 'Source City can not be more than 50 characters'],
    },
    destinationcity: {
      type: String,
      required: [true, 'Please Enter a Destination City'],
      trim: true,
      maxlength: [50, 'Destination City can not be more than 50 characters'],
    },
    slab: {
      type: String,
      trim: true,
      maxlength: [50, 'Slab can not be more than 50 characters'],
      default: 'default',
    },
    distance: {
      type: Number,
      required: [true, 'Please Enter a Distance'],
      trim: true,
      maxlength: [10, 'Distance can not be more than 10 characters'],
    },
    NON_AC_SEATER: {
      type: Number,
      trim: true,
      maxlength: [10, 'Fare can not be more than 10 characters'],
      default: null,
    },
    AC_SEATER: {
      type: Number,
      trim: true,
      maxlength: [10, 'Fare can not be more than 10 characters'],
      default: null,
    },
    NON_AC_SLEEPER: {
      type: Number,
      trim: true,
      maxlength: [10, 'Fare can not be more than 10 characters'],
      default: null,
    },
    AC_SLEEPER: {
      type: Number,
      trim: true,
      maxlength: [10, 'Fare can not be more than 10 characters'],
      default: null,
    },
    MULTI_SEATER: {
      type: Number,
      trim: true,
      maxlength: [10, 'Fare can not be more than 10 characters'],
      default: null,
    },
    MULTI_SLEEPER: {
      type: Number,
      trim: true,
      maxlength: [10, 'Fare can not be more than 10 characters'],
      default: null,
    },
    skipcalculate: {
      type: Boolean,
      default: false,
    },
    aSourceStationID: {
      type: Number,
    },
    aDestinationStationID: {
      type: Number,
    },
    aSourceStationStateName: {
      type: String,
      trim: true,
    },
    aDestinationStateName: {
      type: String,
      trim: true,
    },
    updatedBy: { type: String },
    createdBy: { type: String },
  },
  { timestamps: true }
);

FareConfig.index({ sourcecity: 1, destinationcity: 1 }, { unique: true });

module.exports = mongoose.model('FareConfig', FareConfig, 'fareconfigs');
