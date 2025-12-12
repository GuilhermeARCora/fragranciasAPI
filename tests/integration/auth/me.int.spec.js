const request = require('supertest');
const app = require('../../../config/app');
const { connect, cleanup, disconnect } = require('../../setup/mongo-memory');
const User = require('../../../src/modules/auth/user.model');

describe('GET /api/v1/auth/me', () => {
  const route = '/api/v1/auth/me';

  const password = 'Secret123!';
  const email = 'tester@gmail.com';
  const user = {
    name: 'Tester',
    email,
    password,
    confirmEmail: email,
    confirmPassword: password,
    role: 'client',
    active: true
  };

  beforeAll(async () => {
    await connect();
  });

  afterEach(async () => {
    await cleanup();
  });

  afterAll(async () => {
    await disconnect();
  });

  it('should return user info, if user is authenticated', async () => {
    await User.create(user);

    const loginRes = await request(app)
      .post('/api/v1/auth/login')
      .send({ email, password });

    const cookie = loginRes.headers['set-cookie'];

    const res = await request(app)
      .get(route)
      .set('Cookie', cookie);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('data');
    expect(typeof res.body.data).toBe('object');
  });

  it('should return 401, if user isnt authenticated', async () => {
    const res = await request(app)
      .get(route);

    expect(res.status).toBe(401);
    expect(res.body).toStrictEqual({
      message: 'Você não está autenticado! Por favor acesse sua conta.',
      status: 'fail'
    });
  });
});
