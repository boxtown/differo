const Space = require('./space');
const User = require('./user');

Space.belongsTo(User, { as: 'author' });

module.exports = {
  Space,
  User,
};
