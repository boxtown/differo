const { Space } = require('../database/models');

const getCreateSpace = (req, res) =>
  res.render('space/createSpace', { title: 'Create a new space' });

const postCreateSpace = async (req, res) => {
  const space = await Space.findOne({ where: { name: req.body.name } });
  if (space) {
    req.flash('error', 'Space with name already exists');
    return res.redirect('/create-space');
  }
  await Space.create({ name: req.body.name, creatorId: req.body.creatorId });
  return res.redirect('/');
};

module.exports = {
  getCreateSpace,
  postCreateSpace,
};
