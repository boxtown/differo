const Post = require('./post');
const Space = require('./space');
const User = require('./user');

Post.belongsTo(Space);
Post.belongsTo(User, { as: 'author' });
Space.belongsTo(User, { as: 'creator' });
Space.hasMany(Post);

module.exports = {
  Post,
  Space,
  User,
};
