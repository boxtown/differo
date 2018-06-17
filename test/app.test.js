const request = require('supertest');
const sinon = require('sinon');

jest.mock('../src/middleware/requiresAuth');

const app = require('../src/app');
const passport = require('../src/passport');
const { Space, User } = require('../src/database/models');

describe('GET', () => {
  let sandbox;
  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });
  afterEach(() => {
    sandbox.restore();
  });

  describe('/', () => {
    it('returns a 200 OK', async () => {
      sandbox.stub(Space, 'findAll').returns(Promise.resolve([]));
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
  describe('/space', () => {
    describe('/new', () => {
      it('returns a 200 OK', async () => {
        const res = await request(app).get('/space/new');
        expect(res.status).toBe(200);
      });
    });
    describe('/:slug', () => {
      it('returns a 200 OK', async () => {
        sandbox.stub(Space, 'findOne').returns(Promise.resolve({}));
        const res = await request(app).get('/space/test');
        expect(res.status).toBe(200);
      });
      it('returns a 404 if space does not exist', async () => {
        sandbox.stub(Space, 'findOne').returns(Promise.resolve());
        const res = await request(app).get('/space/test');
        expect(res.status).toBe(404);
      });

      describe('/post/new', () => {
        it('returns a 200 OK', async () => {
          sandbox.stub(Space, 'findOne').returns(Promise.resolve({}));
          const res = await request(app).get('/space/test/post/new');
          expect(res.status).toBe(200);
        });
        it('returns a 404 if space does not exist', async () => {
          sandbox.stub(Space, 'findOne').returns(Promise.resolve());
          const res = await request(app).get('/space/test/post/new');
          expect(res.status).toBe(404);
        });
      });
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
      sandbox.stub(User, 'create').returns(Promise.resolve({ id: 1 }));
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
  describe('/space', () => {
    it('returns a 302 Redirect to the index', async () => {
      sandbox.stub(Space, 'findOne').returns(Promise.resolve());
      sandbox.stub(Space, 'create').returns(Promise.resolve());
      const res = await request(app)
        .post('/space')
        .type('form')
        .send({ name: 'test' });
      expect(res.status).toBe(302);
      expect(res.header.location).toEqual('/');
    });
    it('saves a correct slug', async () => {
      sandbox.stub(Space, 'findOne').returns(Promise.resolve());
      const stub = sandbox.stub(Space, 'create').returns(Promise.resolve());
      await request(app)
        .post('/space')
        .type('form')
        .send({ name: 'My Test Space' });
      expect(stub.calledWith(sinon.match({ slug: 'My-Test-Space' }))).toBe(true);
    });
    it('returns a 302 Redirect back to the /space/new page on clashing space name', async () => {
      sandbox.stub(Space, 'findOne').returns(Promise.resolve('space'));
      const res = await request(app)
        .post('/space')
        .type('form')
        .send({ name: 'test' });
      expect(res.status).toBe(302);
      expect(res.header.location).toEqual('/space/new');
    });
    it('returns a 302 Redirect back to the /space/new page on reserved space name', async () => {
      const res = await request(app)
        .post('/space')
        .type('form')
        .send({ name: 'New' });
      expect(res.status).toBe(302);
      expect(res.header.location).toEqual('/space/new');
    });
    it('returns a 302 Redirect back to the /space/new page on space name too long', async () => {
      const res = await request(app)
        .post('/space')
        .type('form')
        .send({ name: 'a'.repeat(256) });
      expect(res.status).toBe(302);
      expect(res.header.location).toEqual('/space/new');
    });
    it('returns a 302 Redirect back to the /space/new page on space name not ascii', async () => {
      const res = await request(app)
        .post('/space')
        .type('form')
        .send({ name: '♥' });
      expect(res.status).toBe(302);
      expect(res.header.location).toEqual('/space/new');
    });
  });
});
