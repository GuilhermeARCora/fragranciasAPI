const request = require('supertest');
const app = require('../../../config/app');
const { connect, cleanup, disconnect } = require('../../setup/mongo-memory');
const User = require('../../../src/modules/auth/user.model');

describe('POST /api/v1/auth/signup', () => {
  const route = '/api/v1/auth/signup';

  const password = 'Secret123!';
  const email = 'tester@gmail.com';
  const user = {
    name: 'Tester',
    email,
    password,
    confirmEmail: email,
    confirmPassword: password
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

  it('should create a new user when the payload is valid', async () => {
    const res = await request(app)
      .post(route)
      .send(user);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('data');
    expect(typeof res.body.data).toBe('object');
  });

  it('should respond with 409 when there is duplicated email', async () => {
    await User.create(user);
    const res = await request(app)
      .post(route)
      .send(user);

    expect(res.status).toBe(409);
    expect(res.body).toStrictEqual({
      message: 'Campo duplicado: email = "tester@gmail.com". Por favor, use outro valor!',
      status: 'fail'
    });
  });

  it('should answer 400 when the payload is invalid', async () => {
    const res = await request(app)
      .post(route)
      .send({
        name: 'Tester',
        email,
        confirmEmail: email,
        confirmPassword: password
      });

    expect(res.status).toBe(400);
    expect(res.body).toStrictEqual({
      message: 'Dados inválidos. Senha é obrigatório',
      status: 'fail'
    });
  });
});
