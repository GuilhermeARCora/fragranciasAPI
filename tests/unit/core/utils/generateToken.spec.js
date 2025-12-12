const jwt = require('jsonwebtoken');
const generateToken = require('../../../../src/core/utils/generateToken');

describe('generateToken()', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV };
    process.env.JWT_SECRET = 'test-secret';
    process.env.JWT_EXPIRES_IN = '1h';
    process.env.JWT_COOKIE_EXPIRES_IN = 6;
    process.env.NODE_ENV = 'development';
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  it('should generate a valid JWT token containing the user id', () => {
    const res = { cookie: jest.fn() }; // mock do Express response
    const token = generateToken('user123', res);

    // verifica que o token decodifica corretamente
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    expect(decoded._id).toBe('user123');
  });

  it('should set a cookie with correct parameters', () => {
    const res = { cookie: jest.fn() };
    const token = generateToken('user123', res);

    expect(res.cookie).toHaveBeenCalledTimes(1);
    expect(res.cookie).toHaveBeenCalledWith(
      'jwt',
      token,
      expect.objectContaining({
        httpOnly: true,
        secure: false, // pois NODE_ENV = 'development'
        sameSite: 'Lax'
      })
    );
  });

  it('should set secure cookie options in production', () => {
    process.env.NODE_ENV = 'production';

    const res = { cookie: jest.fn() };
    const token = generateToken('user123', res);

    expect(res.cookie).toHaveBeenCalledWith(
      'jwt',
      token,
      expect.objectContaining({
        secure: true,
        sameSite: 'Strict'
      })
    );
  });
});
