const session = require('express-session');
const RedisStore = require('connect-redis')(session);

function buildConfig(production, secret) {
  const config = {
    secret,
    httpOnly: true,
    resave: false,
    saveUninitialized: false,
    cookie: {},
  };
  if (production) {
    const store = new RedisStore({
      host: process.env.DIFFERO_REDIS_HOST || 'localhost',
      port: parseInt(process.env.DIFFERO_REDIS_PORT || '6379', 10),
    });
    config.store = store;
    config.cookie.secure = true;
  }
  return config;
}

module.exports = buildConfig;
