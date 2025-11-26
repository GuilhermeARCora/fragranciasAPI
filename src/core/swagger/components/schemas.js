const swaggerSchemas = {
  User: {
    type: 'object',
    properties: {
      _id: { type: 'string', example: '64d6c18f22c13b7e0c5e9d42' },
      name: { type: 'string', example: 'João Silva' },
      email: { type: 'string', example: 'joao@email.com' },
      role: { type: 'string', example: 'client' },
      active: { type: 'boolean', example: true },
      createdAt: { type: 'string', example: '2025-10-21T19:11:00.000Z' },
      updatedAt: { type: 'string', example: '2025-10-21T19:11:00.000Z' }
    }
  },
  Product: {
    type: 'object',
    properties: {
      _id: {
        type: 'string',
        example: '64d6c18f22c13b7e0c5e9d42'
      },
      name: {
        type: 'string',
        example: 'Aromatizador Bamboo'
      },
      fullPrice: {
        type: 'number',
        example: 79.90
      },
      description: {
        type: 'string',
        example: 'Aromatizador premium com fragrância de bamboo.'
      },
      image: {
        type: 'string',
        example: 'https://storage.example.com/bamboo.png'
      },
      categories: {
        type: 'array',
        items: {
          type: 'string',
          enum: ['aromatizadores', 'autoCuidado', 'casaEBemEstar', 'destaque']
        },
        example: ['aromatizadores']
      },
      active: {
        type: 'boolean',
        example: true
      },
      promoPercentage: {
        type: 'number',
        example: 15
      },
      cod: {
        type: 'string',
        example: 'PRD-00123'
      },
      createdAt: {
        type: 'string',
        example: '2025-10-21T19:11:00.000Z'
      },
      updatedAt: {
        type: 'string',
        example: '2025-10-21T19:11:00.000Z'
      }
    }
  },
  Order: {
    type: 'object',
    properties: {
      _id: {
        type: 'string',
        example: '64d6c18f22c13b7e0c5e9d42'
      },
      items: {
        type: 'array',
        items: { $ref: '#/components/schemas/OrderItem' }
      },
      status: {
        type: 'string',
        enum: ['PENDENTE', 'CONCLUIDO', 'CANCELADO'],
        example: 'PENDENTE'
      },
      totalUnits: {
        type: 'number',
        example: 3
      },
      totalFullPrice: {
        type: 'number',
        example: 239.70
      },
      totalCurrentPrice: {
        type: 'number',
        example: 215.73
      },
      totalDiscount: {
        type: 'number',
        example: 23.97
      },
      totalPixPrice: {
        type: 'number',
        example: 204.94
      },
      dayItWasIssued: {
        type: 'string',
        example: '21/10/2025 14:30'
      },
      createdAt: {
        type: 'string',
        example: '2025-10-21T19:11:00.000Z'
      },
      updatedAt: {
        type: 'string',
        example: '2025-10-21T19:11:00.000Z'
      }
    }
  },
  OrderItem: {
    type: 'object',
    properties: {
      _id: {
        type: 'string',
        example: '64d6c18f22c13b7e0c5e9d42'
      },
      name: {
        type: 'string',
        example: 'Aromatizador Bamboo'
      },
      fullPrice: {
        type: 'number',
        example: 79.90
      },
      promoPercentage: {
        type: 'number',
        example: 10
      },
      amount: {
        type: 'number',
        example: 2
      },
      image: {
        type: 'string',
        example: 'https://storage.example.com/bamboo.png'
      },
      currentPrice: {
        type: 'number',
        example: 71.91
      }
    }
  }
};

module.exports = { swaggerSchemas };
