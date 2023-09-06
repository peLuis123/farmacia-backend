const swaggerJsdoc = require('swagger-jsdoc');
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Clínica Sanfleet',
      version: '1.0.0',
      description: 'Documentación de la API de la Clínica Sanfleet',
    },
    servers: [
      {
        url: 'https://farmacia-backend-0idh-dev.fl0.io/',
        description: 'Servidor',
      },
    ],
  },
  apis: ['./routes/*.js'],
};
const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
