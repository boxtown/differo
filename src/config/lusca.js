module.exports = {
  csrf: process.env.NODE_ENV !== 'test',
  xframe: 'SAMEORIGIN',
  xssProtection: true,
};
