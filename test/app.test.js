const request = require('supertest');
const sinon = require('sinon');

const app = require('../src/app');
const passport = require('../src/passport');
const { User } = require('../src/database/models');

describe('GET', () => {
  describe('/', () => {
    it('returns a 200 OK', async () => {
      const res = await request(app).get('/');
      expect(res.status).toBe(200);
    });
  });
  describe('/login', () => {
    it('returns a 200 OK', async () => {
      const res = await request(app).get('/log-in');
      expect(res.status).toBe(200);
    });
  });
  describe('/sign-up', () => {
    it('returns a 200 OK', async () => {
      const res = await request(app).get('/sign-up');
      expect(res.status).toBe(200);
    });
  });
});

describe('POST', () => {
  let sandbox;
  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });
  afterEach(() => {
    sandbox.restore();
  });

  describe('/log-in', () => {
    it('relies on passport authenticate', async () => {
      const stub = sandbox.stub(passport, 'authenticate').returns((req, res) => res.redirect('/'));
      await request(app)
        .post('/log-in')
        .type('form')
        .send({ username: 'test' })
        .send({ password: 'test' });
      expect(stub.called).toBe(true);
    });
    it('returns a 302 Redirect back to the sign-up page on username too long', async () => {
      const res = await request(app)
        .post('/log-in')
        .type('form')
        .send({ username: 'a'.repeat(256) })
        .send({ password: 'test' });
      expect(res.status).toBe(302);
      expect(res.header.location).toEqual('/log-in');
    });
  });
  describe('/sign-up', () => {
    it('returns a 302 Redirect to the index', async () => {
      sandbox.stub(User, 'findByUsernameOrEmail').returns(Promise.resolve());
      sandbox.stub(User, 'create').returns(Promise.resolve());
      const res = await request(app)
        .post('/sign-up')
        .type('form')
        .send({ email: 'test@test.com' })
        .send({ username: 'test' })
        .send({ password: 'test' });
      expect(res.status).toBe(302);
      expect(res.header.location).toEqual('/');
    });
    it('returns a 302 Redirect back to the sign-up page on clashing username/email', async () => {
      sandbox.stub(User, 'findByUsernameOrEmail').returns(Promise.resolve('user'));
      const res = await request(app)
        .post('/sign-up')
        .type('form')
        .send({ email: 'test@test.com' })
        .send({ username: 'test' })
        .send({ password: 'test' });
      expect(res.status).toBe(302);
      expect(res.header.location).toEqual('/sign-up');
    });
    it('returns a 302 Redirect back to the sign-up page on invalid email format', async () => {
      const res = await request(app)
        .post('/sign-up')
        .type('form')
        .send({ email: 'test' })
        .send({ username: 'test' })
        .send({ password: 'test' });
      expect(res.status).toBe(302);
      expect(res.header.location).toEqual('/sign-up');
    });
    it('returns a 302 Redirect back to the sign-up page on email too long', async () => {
      const res = await request(app)
        .post('/sign-up')
        .type('form')
        .send({ email: `${'a'.repeat(256)}@test.com` })
        .send({ username: 'test' })
        .send({ password: 'test' });
      expect(res.status).toBe(302);
      expect(res.header.location).toEqual('/sign-up');
    });
    it('returns a 302 Redirect back to the sign-up page on username too long', async () => {
      const res = await request(app)
        .post('/sign-up')
        .type('form')
        .send({ email: 'test@test.com' })
        .send({ username: 'a'.repeat(256) })
        .send({ password: 'test' });
      expect(res.status).toBe(302);
      expect(res.header.location).toEqual('/sign-up');
    });
    it('returns a 302 Redirect back to the sign-up page on password too short', async () => {
      const res = await request(app)
        .post('/sign-up')
        .type('form')
        .send({ email: 'test@test.com' })
        .send({ username: 'test' })
        .send({ password: '' });
      expect(res.status).toBe(302);
      expect(res.header.location).toEqual('/sign-up');
    });
  });
});
