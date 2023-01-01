const passport = require('passport');
const LocalStrategy = require('passport-local');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const bcrypt = require('bcrypt');

const User = require('../models/user.model');
const config = require('./config');

const localLogin = new LocalStrategy(
  { usernameField: 'phonenumber' },
  async (phonenumber, password, done) => {
    let number = parseInt(phonenumber, 10);
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

const jwtLogin = new JwtStrategy(
  {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.jwtSecret,
  },
  async (payload, done) => {
    let user = await User.findById(payload._id);
    if (!user) {
      return done(null, false);
    }
    user = user.toObject();
    delete user.hashedPassword;
    done(null, user);
  }
);
passport.use(jwtLogin);
passport.use(localLogin);

module.exports = passport;
