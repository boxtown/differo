const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { User } = require('./database/models');

passport.serializeUser((user, done) => done(null, user.id));

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

passport.use(new LocalStrategy(async (username, password, done) => {
  try {
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return done(null, false, 'Username/password combination is invalid');
    }
    if (!(await user.passwordMatches(password))) {
      return done(null, false, 'Username/password combination is invalid');
    }
    return done(null, user);
  } catch (err) {
    return done(err);
  }
}));

module.exports = passport;
