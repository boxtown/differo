function typeToAlertClass(type) {
  if (type === 'error') {
    return 'danger';
  }
  return type;
}

function transformFlashMessages(type) {
  return message => ({ type: typeToAlertClass(type), message });
}

const types = ['info', 'error', 'success'];

module.exports = (req, res, next) => {
  res.locals.flash = types
    .map(type => req.flash(type).map(transformFlashMessages(type)))
    .reduce((acc, el) => acc.concat(el), []);
  next();
};
