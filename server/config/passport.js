/**
 * Passport strategies
 *
 * Extract access_token from response headers
 * Use our server's secret key to decrypt it's values
 * Use token extracted values to match records in the database
 *
 * @type {JwtStrategy}
 */
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const mongoose = require('mongoose');
const keys = require('./keys');

const User = mongoose.model('users');

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: keys.jwtKey
};

module.exports = passport => {
  passport.use(new JwtStrategy(options, (jwt_payload, done) => {
    User.findById(jwt_payload.id)
      .then(user => user ? done(null, user) : done(null, false))
      .catch(err => console.log(err));
  }));
};
