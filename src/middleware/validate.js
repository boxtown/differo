const { validationResult } = require('express-validator/check');

module.exports = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages = errors.array().map(error => error.msg);
    messages.forEach(message => req.flash('error', message));
    res.redirect(req.path);
    return;
  }
  next();
};
