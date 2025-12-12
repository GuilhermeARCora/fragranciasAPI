const request = require('supertest');
const app = require('../../../config/app');
const { connect, cleanup, disconnect } = require('../../setup/mongo-memory');
const User = require('../../../src/modules/auth/user.model');

describe('DELETE /api/v1/auth/logout', () => {
  const route = '/api/v1/auth/logout';

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

  it('should logout if there is an authenticated user', async () => {
    await User.create(user);

    const loginRes = await request(app)
      .post('/api/v1/auth/login')
      .send({ email, password });

    const cookies = loginRes.headers['set-cookie'];
    const jwtCookie = cookies.find((c) => c.startsWith('jwt='));
    expect(jwtCookie).toBeDefined();

    const res = await request(app)
      .delete(route)
      .set('Cookie', jwtCookie);

    expect(res.status).toBe(200);
    expect(res.body).toStrictEqual({
      message: 'Desconectado com sucesso!',
      status: 200,
      data: {}
    });
  });

  it('should respond with 401, if there is no authenticated user', async () => {
    const res = await request(app)
      .delete(route);

    expect(res.status).toBe(401);
    expect(res.body).toStrictEqual({
      message: 'Você não está autenticado! Por favor acesse sua conta.',
      status: 'fail'
    });
  });

  it('should logout if there is an authenticated user, should also return sameSite: Strict if env: production', async () => {
    process.env.NODE_ENV = 'production';
    await User.create(user);

    const loginRes = await request(app)
      .post('/api/v1/auth/login')
      .send({ email, password });

    const cookies = loginRes.headers['set-cookie'];
    const jwtCookie = cookies.find((c) => c.startsWith('jwt='));
    expect(jwtCookie).toBeDefined();

    const res = await request(app)
      .delete(route)
      .set('Cookie', jwtCookie);

    expect(res.status).toBe(200);
    expect(res.body).toStrictEqual({
      message: 'Desconectado com sucesso!',
      status: 200,
      data: {}
    });

    expect(jwtCookie).toContain('SameSite=Strict');
  });
});
