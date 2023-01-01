const fareConfigModel = require('../models/fareConfig.model');
const rateConfigModel = require('../models/rateConfig.model');
const logModel = require('../models/log.model');
const ErrorResponse = require('../utils/errorResponse');

// Add Rate Config
exports.addRateConfig = async (body, next) => {
  try {
    let data = body;
    let slab;
    let rate;

    const fare = await rateConfigModel.create(data);
    let routes = await fareConfigModel.find({ slab: body.slab });

    for (let i = 0; i < routes.length; i++) {
      if (routes[i].skipcalculate === true) {
        continue;
      }

      slab = routes[i].slab;
      rate = await rateConfigModel.find({ slab: slab });
      for (let j = 0; j < rate.length; j++) {
        fare2 = rate[j].pricePerKM * routes[i].distance;
        fare2 = Math.ceil(fare2);
        let data2 = rate[j].type;
        routes[i][data2] = fare2;
      }

      query = {
        NON_AC_SEATER: routes[i].NON_AC_SEATER,
        AC_SEATER: routes[i].AC_SEATER,
        NON_AC_SLEEPER: routes[i].NON_AC_SLEEPER,
        AC_SLEEPER: routes[i].AC_SLEEPER,
        MULTI_SLEEPER: routes[i].MULTI_SLEEPER,
        MULTI_SEATER: routes[i].MULTI_SEATER,
      };
      let bootcamp5 = await fareConfigModel.findByIdAndUpdate(
        routes[i]._id,
        query,
        {
          new: true,
          runValidators: true,
        }
      );
    }

    next({
      status: 200,
      success: true,
      data: fare,
    });

    let message = 'The User ' + body.username + ' Has Created New Slab.';
    const logs = await logModel.create({
      username: body.username,
      message: message,
    });
  } catch (err) {
    console.log(err);

    if (err.name === 'ValidationError') {
      const message = Object.values(err.errors).map(val => val.message);
      error = new ErrorResponse(message, 400);
      next(err);
    }

    if (err.code === 11000) {
      console.log(err.message);
      const message = 'Type Pair Is Already Exits!';
      error = new ErrorResponse(message, 400);
      next(err);
    }
  }
};

// Get Rate Configs
exports.getRateConfigList = async (req, res, next) => {
  const config = await rateConfigModel.find(req.query);
  res.status(200).json({ success: true, count: config.length, data: config });
};

// Update Rate Config
exports.updateRateConfig = async (req, next) => {
  const oldRateConfig = await rateConfigModel.findById(req.params.id);
  const newRateConfig = await rateConfigModel.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  let message =
    'The User ' +
    req.body.username +
    ' Has Updated Price Of Slab ' +
    oldRateConfig.type +
    ' From ' +
    oldRateConfig.pricePerKM +
    ' To ' +
    req.body.pricePerKM +
    '.';
  const logs = await logModel.create({
    username: req.body.username,
    message: message,
  });

  if (!newRateConfig) {
    return next(
      new ErrorResponse(`Type not found with id of ${req.params.id}`, 404)
    );
  }
  const fareConfigs = await fareConfigModel.find({ slab: newRateConfig.slab });
  for (let i = 0; i < fareConfigs.length; i++) {
    if (fareConfigs[i].skipcalculate === true) {
      continue;
    }
    //calculateFares(i);
    var newFare = Math.ceil(fareConfigs[i].distance * newRateConfig.pricePerKM);
    var newFareType = newRateConfig.type;
    var update = {};
    if (newFareType === 'NON_AC_SEATER') {
      update = { NON_AC_SEATER: newFare };
    } else if (newFareType === 'AC_SEATER') {
      update = { AC_SEATER: newFare };
    } else if (newFareType === 'NON_AC_SLEEPER') {
      update = { NON_AC_SLEEPER: newFare };
    } else if (newFareType === 'AC_SLEEPER') {
      update = { AC_SLEEPER: newFare };
    } else if (newFareType === 'MULTI_SEATER') {
      update = { MULTI_SEATER: newFare };
    } else if (newFareType === 'MULTI_SLEEPER') {
      update = { MULTI_SLEEPER: newFare };
    }
    var result = await fareConfigModel.findByIdAndUpdate(
      fareConfigs[i].id,
      update,
      {
        new: true,
        runValidators: true,
      }
    );
  }
  next({
    status: 200,
    success: true,
    data: newRateConfig,
  });
};

// Get ReFresh/ ReCalculate Data
exports.refreshData = async (req, next) => {
  const pageNumber = req.body.page || 1;
  const limit = req.body.size || 10;
  let startIndex = (pageNumber - 1) * limit;
  var query = {};
  let updatedFareConfig;
  let result = {};
  if (req.method === 'OPTIONS') {
    next({ status: 201, message: '' });
  } else {
    let message =
      'The User ' + req.query.username + ' Has Clicked On Refresh Data.';
    const logs = logModel.create({
      username: req.query.username,
      message: message,
    });
    let fareConfig = await fareConfigModel.find({});
    for (let i = 0; i < fareConfig.length; i++) {
      if (fareConfig[i].skipcalculate === true) {
        continue;
      }
      let rateConfig = await rateConfigModel.find({ slab: fareConfig[i].slab });
      for (let j = 0; j < rateConfig.length; j++) {
        calculateFares(rateConfig[j], fareConfig[i].distance);
        updatedFareConfig = await fareConfigModel.updateMany(
          { _id: fareConfig[i]._id },
          query,
          {
            new: true,
            runValidators: true,
          }
        );
      }
    }
    result.total = await fareConfigModel.countDocuments();
    result.fareConfig = await fareConfigModel
      .find({})
      .sort('createdAt')
      .skip(startIndex)
      .limit(limit)
      .exec();
    result.count = limit;
    result.page = pageNumber;

    function calculateFares(rateConfig, distance) {
      let a;
      switch (rateConfig.type) {
        case 'NON_AC_SEATER':
          a = distance * rateConfig.pricePerKM;
          a = Math.ceil(a);
          query = { NON_AC_SEATER: a };
          break;
        case 'AC_SEATER':
          a = distance * rateConfig.pricePerKM;
          a = Math.ceil(a);
          query = { AC_SEATER: a };
          break;
        case 'NON_AC_SLEEPER':
          a = distance * rateConfig.pricePerKM;
          a = Math.ceil(a);
          query = { NON_AC_SLEEPER: a };
          break;
        case 'AC_SLEEPER':
          a = distance * rateConfig.pricePerKM;
          a = Math.ceil(a);
          query = { AC_SLEEPER: a };
          break;
        case 'MULTI_SEATER':
          a = distance * rateConfig.pricePerKM;
          a = Math.ceil(a);
          query = { MULTI_SEATER: a };
          break;
        case 'MULTI_SLEEPER':
          a = distance * rateConfig.pricePerKM;
          a = Math.ceil(a);
          query = { MULTI_SLEEPER: a };
          break;
      }
    }

    next({
      status: 200,
      success: true,
      result,
    });
  }
};
