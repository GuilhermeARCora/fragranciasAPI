const swaggerSchemas = {
  UserSignupInput: {
    type: 'object',
    required: ['name', 'email', 'confirmEmail', 'password', 'confirmPassword'],
    properties: {
      name: { type: 'string', example: 'João Silva' },
      email: { type: 'string', example: 'joao@email.com' },
      confirmEmail: { type: 'string', example: 'joao@email.com' },
      password: { type: 'string', example: 'Senha123!' },
      confirmPassword: { type: 'string', example: 'Senha123!' }
    }
  },
  UserLoginInput: {
    type: 'object',
    required: ['email', 'password'],
    properties: {
      email: { type: 'string', example: 'joao@email.com' },
      password: { type: 'string', example: 'Senha123!' }
    }
  },
  UserResponse: {
    type: 'object',
    properties: {
      _id: { type: 'string', example: '64d6c18f22c13b7e0c5e9d42' },
      name: { type: 'string', example: 'João Silva' },
      email: { type: 'string', example: 'joao@email.com' },
      role: { type: 'string', example: 'client' },
      active: { type: 'boolean', example: true },
      createdAt: { type: 'string', example: '2025-10-21T19:11:00.000Z' }
    }
  }
};

module.exports = { swaggerSchemas };
