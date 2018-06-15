const Sequelize = require('sequelize');
const database = require('../database');

module.exports = database.define('space', {
  name: { type: Sequelize.STRING, allowNull: false, unique: true },
  slug: { type: Sequelize.STRING, allowNull: false, unique: true },
  description: { type: Sequelize.TEXT, allowNull: false },
});
