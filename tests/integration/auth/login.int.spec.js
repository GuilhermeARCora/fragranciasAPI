const request = require('supertest');
const app = require('../../../config/app');
const { connect, cleanup, disconnect } = require('../../setup/mongo-memory');
const User = require('../../../src/modules/auth/user.model');

describe('POST /api/v1/auth/login', () => {
  const route = '/api/v1/auth/login';

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

  it('should authenticate and return token when credentials are valid', async () => {
    await User.create(user);

    const res = await request(app)
      .post(route)
      .send({
        email, password
      });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('data');
    expect(typeof res.body.data).toBe('string');
  });

  it('should respond with 401 when the password is invalid', async () => {
    await User.create(user);

    const res = await request(app)
      .post(route)
      .send({
        email, password: 'WrongPass'
      });

    expect(res.status).toBe(401);
    expect(res.body).toStrictEqual({
      message: 'Email ou senha inválidos',
      status: 'fail'
    });
  });

  it('should respond with 404 when the email doesnt exist', async () => {
    const res = await request(app)
      .post(route)
      .send({
        email: 'ghost@mail.com', password: 'Any123!'
      });

    expect(res.status).toBe(404);
    expect(res.body).toStrictEqual({
      message: 'Usuário não encontrado',
      status: 'fail'
    });
  });

  it('should respond with 400 when the payload is invalid', async () => {
    const res = await request(app)
      .post(route)
      .send({ email: 'sem-senha@mail.com' });

    expect(res.status).toBe(400);
    expect(res.body).toStrictEqual({
      message: 'Por favor insira email ou senha!',
      status: 'fail'
    });
  });
});
