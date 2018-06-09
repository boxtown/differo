const bcrypt = require('bcrypt');
const Sequelize = require('sequelize');
const database = require('../database');

const User = database.define('user', {
  email: { type: Sequelize.STRING, allowNull: false, unique: true },
  username: { type: Sequelize.STRING, allowNull: false, unique: true },
  password: { type: Sequelize.TEXT, allowNull: false, unique: true },
});

User.beforeCreate(async (user) => {
  const hashed = await bcrypt.hash(user.password, 10);
  user.password = hashed;
});

User.findByUsernameOrEmail = function findByUsernameOrEmail({ username, email }) {
  return User.findOne({
    where: {
      [Sequelize.Op.or]: [{ username }, { email }],
    },
  });
};

User.prototype.passwordMatches = function passwordMatches(password) {
  return bcrypt.compare(password, this.password);
};

module.exports = User;
