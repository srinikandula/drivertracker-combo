const express = require('express');
const asyncHandler = require('express-async-handler');
const passport = require('passport');
const userCtrl = require('../controllers/user.controller');
const authCtrl = require('../controllers/auth.controller');
const config = require('../config/config');

const router = express.Router();
module.exports = router;

router.post(
  '/login',
  passport.authenticate('local', {session: false}),
  login
);

router.post('/otpLogin', passport.authenticate('otp', {session: false}),
  login
);

router.get('/me', passport.authenticate('jwt', {session: false}), login);

router.route('/sendOTP/:phoneNumber').get(function (req, res) {
  authCtrl.findUserByPhoneNumber(req.params.phoneNumber, result => {
    res.status(result.status).json(result);
  })
});

function login(req, res) {
  const userData = {userId: req.user._id, username: req.user.phonenumber};
  userData.token = authCtrl.generateToken(req.user);
  res.json(userData);
}
