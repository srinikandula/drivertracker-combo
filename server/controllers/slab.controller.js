const rateConfigModel = require('../models/rateConfig.model');
const fareConfigModel = require('../models/fareConfig.model');

exports.getSlabs = async (req, next) => {
  try {
    const result = await rateConfigModel.find({}, { _id: 0 }).select('slab');
    next({ status: 200, success: true, count: result.length, data: result });
  } catch (e) {
    next({ status: 500, success: false, error: e });
  }
};

exports.getAll = async (body, next) => {
  try {
    const pageNumber = body.page || 1;
    const limit = body.size || 10;
    const result = {};
    let query = {};
    if (body.type && body.type.trim().length > 0) {
      query.type = { $regex: new RegExp('^' + body.type, 'i') };
    }
    let startIndex = (pageNumber - 1) * limit;
    result.total = await rateConfigModel.countDocuments(query);
    result.data = await rateConfigModel
      .find(query)
      .sort('createdAt')
      .skip(startIndex)
      .limit(limit)
      .exec();
    result.count = limit;
    result.page = pageNumber;
    next({ status: 200, success: true, result });
  } catch (e) {
    console.log(e);
    next({ status: 500, success: false, error: e });
  }
};
