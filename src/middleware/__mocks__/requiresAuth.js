module.exports = (req, res, next) => {
  res.locals.user = { id: 1, username: 'Fake User' };
  next();
};
