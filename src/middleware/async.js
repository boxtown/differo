/**
 * Middleware to wrap other express middleware/route functions to ensure
 * errors propagate correctly when using async/await.
 *
 * TODO: consider migrating to Koa for better async/await support
 *
 * @param {*} fn The async express function to wrap
 */
module.exports = fn => async (req, res, next) => {
  try {
    await fn(req, res, next);
  } catch (err) {
    next(err);
  }
};
