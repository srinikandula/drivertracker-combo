const express = require('express');
const fareConfigController = require('../controllers/fareConfig.controller');
const passport = require('passport');

const router = express.Router();

router.route('/getFareList').post(function (req, res) {
    fareConfigController
        .getFareList(req.body, result => {
            res.status(result.status).json(result);
        })
        .then(r => console.log(r));
});
router.route('/updateFareConfig/:id').put(function (req, res) {
    fareConfigController
        .updateFareConfig(req, result => {
            res.status(result.status).json(result);
        })
        .then(r => console.log(r));
});

router.route('/createFareConfig').post(function (req, res) {
    fareConfigController
        .addFareConfig(req.body, result => {
            res.status(result.status).json(result);
        })
        .then(r => console.log(r));
});

module.exports = router;
