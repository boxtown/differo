const express = require('express');
const { body } = require('express-validator/check');
const compression = require('compression');
const dotenv = require('dotenv');
const flash = require('connect-flash');
const lusca = require('lusca');
const path = require('path');
const session = require('express-session');

const isProduction = process.env.NODE_ENV === 'production';

// Load dev env vars before loading custom modules
if (!isProduction) {
  dotenv.config();
}

const sessionSecret = process.env.DIFFERO_SESSION_SECRET;
if (!sessionSecret) {
  /* eslint no-console: 0 */
  console.log('Set DIFFERO_SESSION_SECRET env var');
  process.exit(1);
}

const sessionConfig = require('./config/session');
const luscaConfig = require('./config/lusca');
const requiresAuth = require('./middleware/requiresAuth');
const saveFlashToLocals = require('./middleware/saveFlashToLocals');
const validate = require('./middleware/validate');
const passport = require('./passport');
const homeRoutes = require('./routes/home');
const spaceRoutes = require('./routes/space');
const userRoutes = require('./routes/user');

const app = express();
// settings
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'pug');
if (isProduction) {
  app.set('trust proxy', 1);
}

// middleware
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public'), { maxAge: 31557600000 }));
app.use(session(sessionConfig(isProduction, sessionSecret)));
app.use(flash());
app.use(saveFlashToLocals);
app.use(passport.initialize());
app.use(passport.session());
app.use(lusca(luscaConfig));

// routes
app.get('/', homeRoutes.getIndex);
app.get('/create-space', requiresAuth, spaceRoutes.getCreateSpace);
app.get('/log-in', userRoutes.getLogIn);
app.get('/log-out', userRoutes.getLogOut);
app.get('/sign-up', userRoutes.getSignUp);

app.post(
  '/create-space',
  [
    requiresAuth,
    body('name')
      .isLength({ max: 255 })
      .withMessage('Name is invalid'),
    validate,
  ],
  spaceRoutes.postCreateSpace,
);
app.post(
  '/log-in',
  [
    body('username')
      .isLength({ max: 255 })
      .withMessage('Username/password combination is invalid'),
    validate,
  ],
  userRoutes.postLogIn,
);
app.post(
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
  userRoutes.postSignUp,
);

module.exports = app;
