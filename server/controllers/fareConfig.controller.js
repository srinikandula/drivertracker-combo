const fareConfigModel = require('../models/fareConfig.model');
const rateConfigModel = require('../models/rateConfig.model');
const logModel = require('../models/log.model');
const ErrorResponse = require('../utils/errorResponse');

exports.getFareList = async (body, next) => {
    try {
        const pageNumber = body.page || 1;
        const limit = body.size || 10;
        const result = {};
        let query = {};
        if (body.sourcecity && body.sourcecity.trim().length > 0) {
            query.sourcecity = {$regex: new RegExp('^' + body.sourcecity, 'i')};
        }
        if (body.destinationcity && body.destinationcity.trim().length > 0) {
            query.destinationcity = {
                $regex: new RegExp('^' + body.destinationcity, 'i'),
            };
        }
        if (body.skipcalculate) {
            query.skipcalculate = true;
        }

        let startIndex = (pageNumber - 1) * limit;
        result.total = await fareConfigModel.countDocuments(query);
        result.data = await fareConfigModel
            .find(query)
            .sort('createdAt')
            .skip(startIndex)
            .limit(limit)
            .exec();
        result.count = limit;
        result.page = pageNumber;
        next({status: 200, success: true, result});
    } catch (e) {
        console.log(e);
        next({status: 500, success: false, error: e});
    }
};

exports.addFareConfig = async (body, next) => {
    try {
        console.log(body);
        let data = body;
        let slab;
        let rate;

        for (let i = 0; i < data.length; i++) {
            var alreadyExists = await fareConfigModel.find({
                sourcecity: data[i].sourcecity,
                destinationcity: data[i].destinationcity,
            });
            if (alreadyExists && alreadyExists.length > 1) {
                next({
                    status: 500,
                    success: false,
                    data: {error: 'Already exists'},
                });
            } else {
                slab = data[i].slab;
                if (slab == null) {
                    rate = await fareConfigModel.find({slab: 'default'});
                } else {
                    rate = await fareConfigModel.find({slab: slab});
                }
                for (let j = 0; j < rate.length; j++) {
                    fare2 = rate[j].pricePerKM * data[i].distance;
                    fare2 = Math.ceil(fare2);
                    let data2 = rate[j].type;
                    data[i][data2] = fare2;
                }
            }

            const fare = await fareConfigModel.create(data);
            next({
                status: 200,
                success: true,
                data: fare,
            });
            let message = 'The User ' + data[0].username + ' Has Created New Route.';
            const logs = await logModel.create({
                username: data[0].username,
                message: message,
            });
        }
    } catch (err) {
        console.log(err);

        if (err.name === 'ValidationError') {
            const message = Object.values(err.errors).map(val => val.message);
            error = new ErrorResponse(message, 400);
            next(err);
        }

        if (err.code === 11000) {
            console.log(err.message);
            const message = 'City Is Already Exits!';
            error = new ErrorResponse(message, 400);
            next(err);
        }
    }
};

// Update Fares/Routes
exports.updateFareConfig = async (req, next) => {
    var reqBody = req.body;
    var fareConfig = await fareConfigModel.findById(req.params.id);
    var oldFareConfig = fareConfig;
    if (!fareConfig) {
        return next(
            new ErrorResponse(`Type not found with id of ${req.params.id}`, 404)
        );
    }
    var newFares;
    newFares = {
        NON_AC_SEATER: null,
        AC_SEATER: null,
        NON_AC_SLEEPER: null,
        AC_SLEEPER: null,
        MULTI_SEATER: null,
        MULTI_SLEEPER: null,
    };
    if (reqBody.skipcalculate === true) {
        newFares.skipcalculate = reqBody.skipcalculate;
        newFares.slab = reqBody.slab;
        newFares.NON_AC_SEATER = reqBody.NON_AC_SEATER;
        newFares.AC_SEATER = reqBody.AC_SEATER;
        newFares.NON_AC_SLEEPER = reqBody.NON_AC_SLEEPER;
        newFares.AC_SLEEPER = reqBody.AC_SLEEPER;
        newFares.MULTI_SEATER = reqBody.MULTI_SEATER;
        newFares.MULTI_SLEEPER = reqBody.MULTI_SLEEPER;
    } else {
        newFares = {
            NON_AC_SEATER: null,
            AC_SEATER: null,
            NON_AC_SLEEPER: null,
            AC_SLEEPER: null,
            MULTI_SEATER: null,
            MULTI_SLEEPER: null,
        };
        newFares.skipcalculate = false;
        if (fareConfig.slab !== reqBody.slab) {
            newFares.slab = reqBody.slab;
            const rateConfigs = await rateConfigModel.find({slab: reqBody.slab});
            for (let i = 0; i < rateConfigs.length; i++) {
                newFares[rateConfigs[i].type] = Math.ceil(
                    fareConfig.distance * rateConfigs[i].pricePerKM
                );
            }
        } else {
            const rateConfigs = await rateConfigModel.find({slab: fareConfig.slab});
            newFares.distance = reqBody.distance;
            for (let i = 0; i < rateConfigs.length; i++) {
                newFares[rateConfigs[i].type] = Math.ceil(
                    reqBody.distance * rateConfigs[i].pricePerKM
                );
            }
        }
    }

    fareConfig = await fareConfigModel.findByIdAndUpdate(
        req.params.id,
        newFares,
        {
            new: true,
            runValidators: true,
        }
    );
    var reverseRoute = {};
    reverseRoute.skipcalculate = fareConfig.skipcalculate;
    reverseRoute.slab = fareConfig.slab;
    reverseRoute.distance = fareConfig.distance;
    reverseRoute.NON_AC_SEATER = fareConfig.NON_AC_SEATER;
    reverseRoute.AC_SEATER = fareConfig.AC_SEATER;
    reverseRoute.NON_AC_SLEEPER = fareConfig.NON_AC_SLEEPER;
    reverseRoute.AC_SLEEPER = fareConfig.AC_SLEEPER;
    reverseRoute.MULTI_SEATER = fareConfig.MULTI_SEATER;
    reverseRoute.MULTI_SLEEPER = fareConfig.MULTI_SLEEPER;
    reverseRoute = await fareConfigModel.updateMany(
        {
            destinationcity: fareConfig.sourcecity,
            sourcecity: fareConfig.destinationcity,
        },
        {$set: reverseRoute}
    );
    logTheChange(req, oldFareConfig, fareConfig);
    next({
        status: 200,
        success: true,
        data: fareConfig,
    });
};

function logTheChange(req, old, naya) {
    let message;
    if (old.distance !== naya.distance) {
        message =
            'The User ' +
            req.body.username +
            ' Has Updated Distance Of ' +
            old.sourcecity +
            ' - ' +
            old.destinationcity +
            ' From ' +
            old.distance +
            ' To ' +
            naya.distance +
            '.';
        const logs = logModel.create({
            username: req.body.username,
            message: message,
        });
    } else if (old.slab !== naya.slab) {
        message =
            'The User ' +
            req.body.username +
            ' Has Updated Slab Of ' +
            old.sourcecity +
            ' - ' +
            old.destinationcity +
            ' From ' +
            old.slab +
            ' To ' +
            naya.slab +
            '.';
        const logs = logModel.create({
            username: req.body.username,
            message: message,
        });
    } else if (old.NON_AC_SEATER !== naya.NON_AC_SEATER) {
        message =
            'The User ' +
            req.body.username +
            ' Has Updated NON_AC_SEATER Price Of ' +
            old.sourcecity +
            ' - ' +
            old.destinationcity +
            ' From ' +
            old.NON_AC_SEATER +
            ' To ' +
            naya.NON_AC_SEATER +
            '.';
        const logs = logModel.create({
            username: req.body.username,
            message: message,
        });
    } else if (old.NON_AC_SLEEPER !== naya.NON_AC_SLEEPER) {
        message =
            'The User ' +
            req.body.username +
            ' Has Updated NON_AC_SLEEPER Price Of ' +
            old.sourcecity +
            ' - ' +
            old.destinationcity +
            ' From ' +
            old.NON_AC_SLEEPER +
            ' To ' +
            naya.NON_AC_SLEEPER +
            '.';
        const logs = logModel.create({
            username: req.body.username,
            message: message,
        });
    } else if (old.AC_SEATER !== naya.AC_SEATER) {
        message =
            'The User ' +
            req.body.username +
            ' Has Updated AC_SEATER Price Of ' +
            old.sourcecity +
            ' - ' +
            old.destinationcity +
            ' From ' +
            old.AC_SEATER +
            ' To ' +
            naya.AC_SEATER +
            '.';
        const logs = logModel.create({
            username: req.body.username,
            message: message,
        });
    } else if (old.AC_SLEEPER !== naya.AC_SLEEPER) {
        message =
            'The User ' +
            req.body.username +
            ' Has Updated AC_SLEEPER Price Of ' +
            old.sourcecity +
            ' - ' +
            old.destinationcity +
            ' From ' +
            old.AC_SLEEPER +
            ' To ' +
            naya.AC_SLEEPER +
            '.';
        const logs = logModel.create({
            username: req.body.username,
            message: message,
        });
    } else if (old.MULTI_SEATER !== naya.MULTI_SEATER) {
        message =
            'The User ' +
            req.body.username +
            ' Has Updated MULTI_SEATER Price Of ' +
            old.sourcecity +
            ' - ' +
            old.destinationcity +
            ' From ' +
            old.MULTI_SEATER +
            ' To ' +
            naya.MULTI_SEATER +
            '.';
        const logs = logModel.create({
            username: req.body.username,
            message: message,
        });
    } else if (old.MULTI_SLEEPER !== naya.MULTI_SLEEPER) {
        message =
            'The User ' +
            req.body.username +
            ' Has Updated MULTI_SLEEPER Price Of ' +
            old.sourcecity +
            ' - ' +
            old.destinationcity +
            ' From ' +
            old.MULTI_SLEEPER +
            ' To ' +
            naya.MULTI_SLEEPER +
            '.';
        const logs = logModel.create({
            username: req.body.username,
            message: message,
        });
    } else if (old.skipcalculate !== naya.skipcalculate) {
        message =
            'The User ' +
            req.body.username +
            ' Has Updated Recalculate Status Of ' +
            old.sourcecity +
            ' - ' +
            old.destinationcity +
            ' From ' +
            old.skipcalculate +
            ' To ' +
            naya.skipcalculate +
            '.';
        const logs = logModel.create({
            username: req.body.username,
            message: message,
        });
    }
}
