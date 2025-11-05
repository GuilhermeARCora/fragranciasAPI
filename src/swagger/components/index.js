// index.js - compose everything for swagger
const { swaggerSchemas } = require('./schemas');
const { PositiveResponses } = require('./responses/positive');
const { ErrorResponses } = require('./responses/errors');

const swaggerComponents = {
  schemas: { ...swaggerSchemas },
  responses: {
    ...PositiveResponses,
    ...ErrorResponses
  }
};

module.exports = { swaggerComponents };
