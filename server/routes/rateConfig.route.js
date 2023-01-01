const express = require('express');
const rateConfigController = require('../controllers/rateConfig.controller');
const passport = require('passport');

const router = express.Router();

router.route('/getRateConfig').get(function (req, res) {
  rateConfigController
    .getRateConfigList(req.body, result => {
      res.status(result.status).json(result);
    })
    .then(r => console.log(r));
});
router.route('/updateRateConfig/:id').put(function (req, res) {
  rateConfigController
    .updateRateConfig(req, result => {
      res.status(result.status).json(result);
    })
    .then(r => console.log(r));
});

router.route('/addRateConfig').post(function (req, res) {
  rateConfigController
    .addRateConfig(req.body, result => {
      res.status(result.status).json(result);
    })
    .then(r => console.log(r));
});

router.route('/refreshdata').post(function (req, res) {
  rateConfigController
    .refreshData(req, result => {
      res.status(result.status).json(result);
    })
    .then(r => console.log(r));
});

module.exports = router;
