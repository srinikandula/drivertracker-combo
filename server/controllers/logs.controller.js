const logModel = require('../models/log.model');

exports.getLogs = async (body, next) => {
  try {
    const pageNumber = body.page || 1;
    const limit = body.size || 10;
    const result = {};
    let query = {};
    if (body.search && body.search.trim().length > 0) {
      query = {
        $or: [
          { message: { $regex: new RegExp(body.search, 'i') } },
          {
            $expr: {
              $regexMatch: {
                input: { $toString: '$username' },
                regex: body.search,
              },
            },
          },
        ],
      };
    }
    let startIndex = (pageNumber - 1) * limit;
    result.total = await logModel.countDocuments(query);
    result.data = await logModel
      .find(query)
      .sort({ Date: -1 })
      .skip(startIndex)
      .limit(limit)
      .exec();
    result.count = limit;
    result.page = pageNumber;
    next({ status: 200, success: true, result });
  } catch (e) {
    next({ status: 500, success: false, error: e });
  }
};
