module.exports = (req, res, next) => {
  if (req.user) {
    next();
    return;
  }
  req.session.redirectTo = req.path;
  res.redirect('/log-in');
};
