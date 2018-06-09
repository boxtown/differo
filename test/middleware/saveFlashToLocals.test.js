const saveFlashToLocals = require('../../src/middleware/saveFlashToLocals');

describe('saveFlashToLocals', () => {
  it('properly saves flash messages to response locals', () => {
    const req = {
      flash: () => ['message'],
    };
    const res = { locals: {} };
    const next = () => {};
    saveFlashToLocals(req, res, next);
    expect(res.locals.flash).toEqual([
      { type: 'info', message: 'message' },
      { type: 'danger', message: 'message' },
      { type: 'success', message: 'message' },
    ]);
  });
});
