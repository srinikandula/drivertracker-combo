const passport = require('passport');
const LocalStrategy = require('passport-local');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const bcrypt = require('bcrypt');

const OTPColl = require('../models/otp.model');
const config = require('./config');

const localLogin = new LocalStrategy(
  {
    usernameField: 'phonenumber',
    passwordField: 'password'
  },
  async (phonenumber, password, done) => {
    let user = await User.findOne({ phonenumber: number });
    console.log('===> ', user);
    if (!user) {
      done({
        status: 400,
        message: 'Username does not exist..!',
      });
    } else {
      try {
        if (password === user.password) {
          user = user.toObject();
          delete user.password;
          done(null, user);
        } else {
          done({ status: 400, message: 'Password incorrect..!' });
        }
      } catch (e) {
        // console.log(e, "==>", user);
        return done(e);
      }
    }
  }
);

// Otp Strategy

const otpLogin = new LocalStrategy(
  {
    usernameField: 'contactNumber',
    passwordField: 'loginOtp'
  },
  async (contactNumber, loginOtp, done) => {
    let userOtp = await OTPColl.findOne({  "contactNumber":contactNumber,"loginOtp":loginOtp });
    if (!userOtp || !userOtp.active) {
      done({status: 400, message: 'Incorrect OTP!'});
    } if (userOtp.expiresOn.getMilliseconds() < new Date().getMilliseconds()) {
      done({status: 400, message: 'OTP expired!'});
    }  else {
      try {
        if (loginOtp === userOtp.loginOtp) {
          userOtp = userOtp.toObject();
          let updateResult = await OTPColl.updateMany({  contactNumber:contactNumber,"active":true },{"active":false});
          console.log("update result "+ updateResult);
          delete userOtp.loginOtp;
          done(null, userOtp);
        } else {
          done({ status: 400, message: 'OTP is Wrong..!' });
        }
      } catch (e) {
        // console.log(e, "==>", user);
        return done(e);
      }
    }
  }
);

const jwtLogin = new JwtStrategy(
  {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.jwtSecret,
  },
  async (payload, done) => {
    let user = await OTPColl.findById(payload._id);
    if (!user) {
      return done(null, false);
    }
    user = user.toObject();
    delete user.loginOtp;
    done(null, user);
  }
);
passport.use(jwtLogin);
passport.use(localLogin);
passport.use('otp', otpLogin);

module.exports = passport;
