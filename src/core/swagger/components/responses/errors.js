const ErrorResponses = {
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
            },
            errors: { type: 'array', example: [{ field: 'email', message: 'is required' }] }
          }
        }
      }
    }
  },
  DuplicateError: {
    description: 'Campo duplicado (unique constraint).',
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
};

module.exports = { ErrorResponses };
