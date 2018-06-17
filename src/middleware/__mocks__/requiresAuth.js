const mockUser = { id: 1, username: 'Mock User' };

module.exports = (req, res, next) => {
  req.user = mockUser;
  res.locals.user = mockUser;
  next();
};
