const { Space } = require('../database/models');

const getIndex = async (req, res) => {
  const spaces = await Space.findAll();
  res.render('home', { title: 'Home', spaces });
};

module.exports = {
  getIndex,
};
