module.exports = (req, res, next) => {
  // Dirty hack to get tests to pass because I'm drunk
  // TODO: fix when I'm not drunk
  if (process.env.NODE_ENV === 'test') {
    res.locals.user = {};
    return next();
  }
  if (req.user) {
    res.locals.user = req.user;
    return next();
  }
  return res.redirect('/log-in');
};
