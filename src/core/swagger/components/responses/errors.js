const ErrorResponses = {
  BadRequest: {
    description: 'Os dados passados são inválidos.',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            status: { type: 'string', example: 'fail' },
            message: {
              type: 'string',
              example: 'Os dados passados são inválidos!'
            }
          }
        }
      }
    }
  },
  DuplicateError: {
    description: 'Campo duplicado.',
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
            message: { type: 'string', example: 'Credenciais inválidas ou token inválido.' }
          }
        }
      }
    }
  },
  InternalServerError: {
    description: 'Erro interno do servidor.',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            status: { type: 'string', example: 'fail' },
            message: { type: 'string', example: 'Erro interno do servidor.' }
          }
        }
      }
    }
  },
  NotFoundError: {
    description: 'Recurso não encontrado.',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            status: { type: 'string', example: 'fail' },
            message: { type: 'string', example: 'Recurso não encontrado.' }
          }
        }
      }
    }
  },
  ForbiddenError: {
    description: 'Você não possui autorizacão.',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            status: { type: 'string', example: 'fail' },
            message: { type: 'string', example: 'Você não possui autorizacão.' }
          }
        }
      }
    }
  }
};

module.exports = { ErrorResponses };
