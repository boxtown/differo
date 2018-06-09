const Post = require('./post');
const Space = require('./space');
const User = require('./user');

Post.belongsTo(Space);
Post.belongsTo(User, { as: 'author' });
Space.belongsTo(User, { as: 'creator' });

module.exports = {
  Post,
  Space,
  User,
};
