const { validationResult } = require('express-validator/check');

module.exports = (opts = {}) => (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages = errors.array().map(error => error.msg);
    messages.forEach(message => req.flash('error', message));
    res.redirect(opts.redirectPath || req.path);
    return;
  }
  next();
};
