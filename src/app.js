const express = require('express');
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
const saveFlashToLocals = require('./middleware/saveFlashToLocals');
const passport = require('./passport');
const homeRouter = require('./routes/home');
const spaceRouter = require('./routes/space');
const userRouter = require('./routes/user');

const app = express();
app.locals.moment = require('moment');

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
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

// routes
app.use(homeRouter);
app.use(userRouter);
app.use('/space', spaceRouter);

module.exports = app;
