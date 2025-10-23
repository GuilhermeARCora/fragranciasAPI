const swaggerComponents = {
  schemas: {
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
  },
  responses: {
    ValidationError: {
      description: 'Erro de validação nos dados enviados.',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              status: { type: 'string', example: 'fail' },
              message: {
                type: 'string',
                example: 'Dados inválidos: Email é obrigatório. A senha deve ter pelo menos 8 caracteres.'
              }
            }
          }
        }
      }
    },
    DuplicateError: {
      description: 'Email já cadastrado.',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              status: { type: 'string', example: 'fail' },
              message: {
                type: 'string',
                example: 'Campo duplicado: email = "joao@email.com". Por favor, use outro valor!'
              }
            }
          }
        }
      }
    },
    UnauthorizedError: {
      description: 'Credenciais inválidas ou token inválido.',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              status: { type: 'string', example: 'fail' },
              message: { type: 'string', example: 'Email ou senha incorretos' }
            }
          }
        }
      }
    }
  }
};

module.exports = { swaggerComponents };
