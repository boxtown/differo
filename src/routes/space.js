const getCreateSpace = (req, res) =>
  res.render('space/createSpace', { title: 'Create a new space' });

const postCreateSpace = (req, res) => res.redirect('/');

module.exports = {
  getCreateSpace,
  postCreateSpace,
};
