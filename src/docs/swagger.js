const swaggerJsdoc = require("swagger-jsdoc");
const apis = require("../routes/user.routes");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Hack2Skills Test API",
      version: "1.0.0",
      description: "CRUD API for Task",
    },
  },
  apis: ["./src/routes/*.js"],
};

const specs = swaggerJsdoc(options);

module.exports = specs;
