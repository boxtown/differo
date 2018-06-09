const app = require('./app');
const { database } = require('./database');
const logger = require('./logger');

const port = process.env.DIFFERO_PORT || 3000;
database.authenticate()
  .then(() => database.sync())
  .then(() => app.listen(port, () => logger.info(`listening on ${port}`)))
  .catch(err => logger.error('Database initialization error:', err));
