const express = require('express');
const { body } = require('express-validator/check');

const async = require('../middleware/async');
const validate = require('../middleware/validate');
const passport = require('../passport');
const { User } = require('../database/models');

const getLogIn = (req, res) => res.render('account/logIn', { title: 'Log In' });

const getLogOut = (req, res) => {
  req.logOut();
  res.redirect('/');
};
const getSignUp = (req, res) => res.render('account/signUp', { title: 'Sign Up' });

// Wrapping the call to authenticate allows us to test it properly
// by stubbing out passport.authenticate
const postLogIn = (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/log-in',
    failureFlash: true,
  })(req, res, next);
};

const postSignUp = async (req, res) => {
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
  await req.logIn(user);
  return res.redirect('/');
};

const router = express.Router();

// Middleware to promisify the passport-injected logIn method.
// Borrowed from https://github.com/rkusa/koa-passport/blob/master/lib/framework/koa.js#L46
router.use((req, res, next) => {
  const { login } = req;
  req.login = req.logIn = (user, options) =>
    new Promise((resolve, reject) => {
      login.call(req, user, options, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  next();
});

router.get('/log-in', getLogIn);
router.get('/log-out', getLogOut);
router.get('/sign-up', getSignUp);

router.post(
  '/log-in',
  [
    body('username')
      .isLength({ max: 255 })
      .withMessage('Username/password combination is invalid'),
    validate,
  ],
  postLogIn,
);
router.post(
  '/sign-up',
  [
    body('email')
      .isEmail()
      .withMessage('Email is invalid')
      .isLength({ max: 255 })
      .withMessage('Email is invalid'),
    body('username')
      .isLength({ max: 255 })
      .withMessage('Username is invalid'),
    body('password')
      .isLength({ min: 1 })
      .withMessage('Password cannot be empty'),
    validate,
  ],
  async(postSignUp),
);

module.exports = router;
