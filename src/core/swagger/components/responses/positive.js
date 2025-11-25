const PositiveResponses = {
  Ok: {
    description: 'Successful request.',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            status: { type: 'string', example: 'success' },
            data: { type: 'object', example: {} }
          }
        }
      }
    }
  },
  Created: {
    description: 'Resource created successfully.',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            status: { type: 'string', example: 'success' },
            data: { type: 'object', example: {} }
          }
        }
      }
    }
  }
};

module.exports = { PositiveResponses };
