// index.js - compose everything for swagger
const { swaggerSchemas } = require('./schemas');
const { ErrorResponses } = require('./responses/errors');

const swaggerComponents = {
  schemas: { ...swaggerSchemas },
  responses: { ...ErrorResponses }
};

module.exports = { swaggerComponents };
