const express = require('express');
const slabController = require('../controllers/slab.controller');

const router = express.Router();

router.route('/getSlabs').get(function (req, res) {
  slabController
    .getSlabs(req.body, result => {
      res.status(result.status).json(result);
    })
    .then(r => console.log(r));
});

router.route('/getAll').post(function (req, res) {
  slabController
    .getAll(req.body, result => {
      res.status(result.status).json(result);
    })
    .then(r => console.log(r));
});

module.exports = router;
