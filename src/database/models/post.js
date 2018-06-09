const Sequelize = require('sequelize');
const database = require('../database');

module.exports = database.define('post', {
  title: { type: Sequelize.STRING, allowNull: false, unique: true },
});
