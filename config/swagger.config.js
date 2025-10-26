require('dotenv').config();
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const rateLimit = require('express-rate-limit');
const { swaggerComponents } = require('../src/swagger/components');

const ENV = process.env.NODE_ENV || 'development';
const IS_PROD = ENV === 'production';

const swaggerOptions = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'FragrânciasDecor API',
      version: '1.0.0',
      description: 'API documentation for FragrânciasDecor backend'
    },
    servers: [
      {
        url: IS_PROD
          ? 'https://fragranciasapi.onrender.com/api-docs/'
          : 'http://localhost:3000',
        description: IS_PROD ? 'Production server' : 'Local development server'
      }
    ],
    components: {
      ...swaggerComponents,
      securitySchemes: {
        bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }
      }
    },
    security: [{ bearerAuth: [] }]
  },
  apis: ['./src/routes/*.js', './src/models/*.js']
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

const swaggerLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: IS_PROD ? 10 : 100,
  message: 'Too many requests to Swagger docs. Try again later.'
});

function setupSwagger(app) {
  app.use('/api-docs', swaggerLimiter, swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  console.log(
    `📘 Swagger docs running at ${
      IS_PROD
        ? 'https://api.fragranciasdecor.com.br/api-docs'
        : 'http://localhost:3000/api-docs'
    }`
  );
}

module.exports = { setupSwagger };
