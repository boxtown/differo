const passport = require('../passport');
const { User } = require('../database/models');

const getIndex = (req, res) => res.render('home', { title: 'Home' });
const getLogIn = (req, res) => res.render('account/logIn', { title: 'Log In' });
const getLogOut = (req, res) => {
  req.logOut();
  res.redirect('/');
};
const getSignUp = (req, res) => res.render('account/signUp', { title: 'Sign Up' });

// Wrapping the call to authenticate allows us to test it properly
// by stubbing out passport.authenticate
const postLogIn = (req, res, next) =>
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/log-in',
    failureFlash: true,
  })(req, res, next);

const postSignUp = async (req, res, next) => {
  let user = await User.findByUsernameOrEmail({
    username: req.body.username,
    email: req.body.email,
  });
  if (user) {
    req.flash('error', 'User with email/username already exists');
    return res.redirect('/sign-up');
  }
  user = await User.create({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
  });
  return req.logIn(user, (err) => {
    if (err) {
      next(err);
    }
    res.redirect('/');
  });
};

module.exports = {
  getIndex,
  getLogIn,
  getLogOut,
  getSignUp,

  postLogIn,
  postSignUp,
};
