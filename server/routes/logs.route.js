const express = require('express');
const logController = require('../controllers/logs.controller');

const router = express.Router();

router.route('/getAll').post(function (req, res) {
  logController
    .getLogs(req.body, result => {
      res.status(result.status).json(result);
    })
    .then(r => console.log(r));
});

module.exports = router;
