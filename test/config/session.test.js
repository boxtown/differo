const sessionConfig = require('../../src/config/session');

describe('Session Configuration', () => {
  describe('default configuration', () => {
    it('provides sane defaults', () => {
      expect(sessionConfig(false, 'test')).toMatchObject({
        httpOnly: true,
        resave: false,
        saveUninitialized: false,
        cookie: {},
      });
    });
  });
  describe('production configuration', () => {
    it('is secure', () => {
      expect(sessionConfig(true, 'test')).toMatchObject({ cookie: { secure: true } });
    });
  });
});
