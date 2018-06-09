const bcrypt = require('bcrypt');
const { User } = require('../../../src/database/models');

describe('User', () => {
  describe('passwordMatches', () => {
    it('checks plaintext password against stored hash', async () => {
      const user = new User();
      user.password = await bcrypt.hash('test', 10);
      expect(await user.passwordMatches('test')).toBe(true);
    });
  });
});
