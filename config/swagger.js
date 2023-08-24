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
        url: 'http://localhost:3000',
        description: 'Servidor local',
      },
    ],
  },
  apis: ['./routes/*.js'],
};
const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
