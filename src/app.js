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
const routes = require('./routes');

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
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

// routes
app.get('/', routes.getIndex);
app.get('/log-in', routes.getLogIn);
app.get('/log-out', routes.getLogOut);
app.get('/sign-up', routes.getSignUp);

app.post('/log-in', routes.postLogIn);
app.post('/sign-up', routes.postSignUp);

module.exports = app;