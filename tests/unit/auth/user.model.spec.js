const bcrypt = require('bcrypt');
const User = require('../../../src/modules/auth/user.model');
const { connect, disconnect, cleanup } = require('../../setup/mongo-memory');

describe('User Model', () => {
  beforeAll(async () => {
    await connect();
  });

  afterEach(async () => {
    await cleanup();
  });

  afterAll(async () => {
    await disconnect();
  });

  // #region VALIDATIONS

  it('should invalidate when password and confirmPassword do not match', async () => {
    const user = new User({
      name: 'Tester',
      email: 'tester@mail.com',
      confirmEmail: 'tester@mail.com',
      password: 'Secret123!',
      confirmPassword: 'WrongPassword!'
    });

    await expect(user.validate()).rejects.toThrow('As senhas não são iguais!');
  });

  it('should invalidate when email and confirmEmail do not match', async () => {
    const user = new User({
      name: 'Tester',
      email: 'tester@mail.com',
      confirmEmail: 'other@mail.com',
      password: 'Secret123!',
      confirmPassword: 'Secret123!'
    });

    await expect(user.validate()).rejects.toThrow('Os emails não são iguais');
  });

  it('should invalidate incorrect email format', async () => {
    const user = new User({
      name: 'Tester',
      email: 'invalid-email',
      confirmEmail: 'invalid-email',
      password: 'Secret123!',
      confirmPassword: 'Secret123!'
    });

    await expect(user.validate()).rejects.toThrow('Por favor, insira um email válido');
  });

  // #region HOOKS

  it('should hash password before save', async () => {
    const rawPassword = 'Secret123!';

    const user = new User({
      name: 'Tester',
      email: 'tester@mail.com',
      confirmEmail: 'tester@mail.com',
      password: rawPassword,
      confirmPassword: rawPassword
    });

    await user.save();

    expect(user.password).not.toBe(rawPassword);
    expect(user.password.startsWith('$2')).toBe(true);
  });

  it('should NOT re-hash the password if it was not modified', async () => {
    const rawPassword = 'Secret123!';

    const hashSpy = jest.spyOn(bcrypt, 'hash');

    const user = await User.create({
      name: 'Tester',
      email: 'tester@mail.com',
      confirmEmail: 'tester@mail.com',
      password: rawPassword,
      confirmPassword: rawPassword
    });

    const originalHash = user.password;

    hashSpy.mockClear();

    user.name = 'NewName';
    await user.save();

    expect(user.password).toBe(originalHash);
    expect(hashSpy).not.toHaveBeenCalled();
    expect(originalHash.startsWith('$2')).toBe(true);
  });

  it('should set passwordChangedAt when password is modified after creation', async () => {
    const pw = 'Secret123!';

    const user = await User.create({
      name: 'Tester',
      email: 'tester@mail.com',
      confirmEmail: 'tester@mail.com',
      password: pw,
      confirmPassword: pw
    });

    const oldPasswordChangedAt = user.passwordChangedAt;

    // Modify password
    user.password = 'NewSecret123!';
    user.confirmPassword = 'NewSecret123!';

    await user.save();

    expect(user.passwordChangedAt).toBeDefined();
    expect(user.passwordChangedAt).not.toEqual(oldPasswordChangedAt);
  });

  // #region METHODS

  it('correctPassword should return true for valid password', async () => {
    const pw = 'Secret123!';

    const user = await User.create({
      name: 'Tester',
      email: 'tester@mail.com',
      confirmEmail: 'tester@mail.com',
      password: pw,
      confirmPassword: pw
    });

    const isValid = await user.correctPassword(pw, user.password);
    expect(isValid).toBe(true);
  });

  it('correctPassword should return false for invalid password', async () => {
    const pw = 'Secret123!';

    const user = await User.create({
      name: 'Tester',
      email: 'tester@mail.com',
      confirmEmail: 'tester@mail.com',
      password: pw,
      confirmPassword: pw
    });

    const isValid = await user.correctPassword('WrongPassword!', user.password);
    expect(isValid).toBe(false);
  });

  // #region STRICT MODE

  it('should ignore unknown fields due to strict:true', async () => {
    const pw = 'Secret123!';

    const user = await User.create({
      name: 'Tester',
      email: 'tester@mail.com',
      confirmEmail: 'tester@mail.com',
      password: pw,
      confirmPassword: pw,
      somethingThatShouldNotExist: 'ignored'
    });

    expect(user.somethingThatShouldNotExist).toBeUndefined();
  });
});
