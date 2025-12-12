jest.mock('../../../src/modules/auth/auth.dao');
const User = require('../../../src/modules/auth/user.model');
const authService = require('../../../src/modules/auth/auth.service');
const authDao = require('../../../src/modules/auth/auth.dao');

describe('AuthService.signup', () => {
  it('should throw 400 when no valid fields are provided', async () => {
    await expect(authService.signup({})).rejects.toMatchObject({
      statusCode: 400,
      message: 'Os dados passados são inválidos!'
    });
  });

  it('should validate user before calling dao', async () => {
    const validateSpy = jest.spyOn(User.prototype, 'validate').mockResolvedValue();

    const payload = {
      name: 'John',
      email: 'john@mail.com',
      confirmEmail: 'john@mail.com',
      password: 'Secret123!',
      confirmPassword: 'Secret123!'
    };

    authDao.signup.mockResolvedValue({ ...payload, _id: '123' });

    await authService.signup(payload);

    expect(validateSpy).toHaveBeenCalled();
  });

  it('should throw validation error when user.validate fails', async () => {
    const validationError = new Error('ValidationError');
    jest.spyOn(User.prototype, 'validate').mockRejectedValue(validationError);

    await expect(authService.signup({
      name: 'A',
      email: 'a@a.com',
      confirmEmail: 'a@a.com',
      password: 'x',
      confirmPassword: 'y'
    })).rejects.toThrow(validationError);
  });

  it('should remove password before returning created user', async () => {
    jest.spyOn(User.prototype, 'validate').mockResolvedValue();

    const mockUser = {
      _id: '123',
      name: 'Tester',
      email: 'test@mail.com',
      password: 'hashed'
    };

    authDao.signup.mockResolvedValue(mockUser);

    const result = await authService.signup({
      name: 'Tester',
      email: 'test@mail.com',
      confirmEmail: 'test@mail.com',
      password: 'Secret123!',
      confirmPassword: 'Secret123!'
    });

    expect(result.password).toBeUndefined();
  });
});

describe('AuthService.login', () => {
  it('should throw 400 if email or password is missing', async () => {
    await expect(authService.login({ email: 'teste@gmail.com' })).rejects.toMatchObject({
      statusCode: 400,
      message: 'Por favor insira email ou senha!'
    });
  });

  it('should throw 404 when DAO returns no user', async () => {
    authDao.login.mockResolvedValue(null);

    await expect(
      authService.login({ email: 'test@mail.com', password: '123456' })
    ).rejects.toMatchObject({
      statusCode: 404,
      message: 'Usuário não encontrado'
    });
  });

  it('should throw 401 when password is incorrect', async () => {
    const mockUser = {
      password: 'hashed',
      correctPassword: jest.fn().mockResolvedValue(false)
    };

    authDao.login.mockResolvedValue(mockUser);

    await expect(
      authService.login({ email: 'test@mail.com', password: 'wrongpass' })
    ).rejects.toMatchObject({
      statusCode: 401,
      message: 'Email ou senha inválidos'
    });

    expect(mockUser.correctPassword).toHaveBeenCalledWith('wrongpass', 'hashed');
  });

  it('should return the user when credentials are valid', async () => {
    const mockUser = {
      password: 'hashed',
      correctPassword: jest.fn().mockResolvedValue(true)
    };

    authDao.login.mockResolvedValue(mockUser);

    const result = await authService.login({
      email: 'test@mail.com',
      password: 'Secret123!'
    });

    expect(result).toBe(mockUser);
    expect(mockUser.correctPassword).toHaveBeenCalledTimes(1);
  });

  it('should trim and lowercase email before querying', async () => {
    const mockUser = {
      password: 'hashed',
      correctPassword: jest.fn().mockResolvedValue(true)
    };

    authDao.login.mockResolvedValue(mockUser);

    await authService.login({
      email: '   TEsT@Mail.Com   ',
      password: '123456'
    });

    expect(authDao.login).toHaveBeenCalledWith('test@mail.com');
  });
});
