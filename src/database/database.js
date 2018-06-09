const Sequelize = require('sequelize');
const config = require('../config/sequelize');

const disableLogging = process.env.NODE_ENV === 'production';

module.exports = new Sequelize(config.database, config.username, config.password, {
  dialect: 'postgres',
  host: config.host,
  /* eslint-disable no-console */
  logging: disableLogging ? false : console.log,
  operatorsAliases: false,
});
