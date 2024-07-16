"use strict";

const AWS = require("aws-sdk");
AWS.config.update({
  region: process.env.AWS_REGION,
});

const middy = require("@middy/core");
const jsonBodyParser = require("@middy/http-json-body-parser");

const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");
const { Joi } = require("celebrate");

const documentClient = new AWS.DynamoDB.DocumentClient();

const userSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

const register = async (event) => {
  try {
    const body = event.body;

    await documentClient
      .put({
        TableName: "users",
        Item: {
          id: uuidv4(),
          name: body.name,
          email: body.email,
          password: bcrypt.hashSync(body.password, 10),
        },
      })
      .promise();

    return {
      statusCode: 201,
      body: JSON.stringify({ message: "Usuário inserido com sucesso!" }),
    };
  } catch (err) {
    if (err.code === "AccessDeniedException") {
      return {
        statusCode: 403,
        body: JSON.stringify({ message: "Acesso negado!" }),
      };
    } else {
      return {
        statusCode: 500,
        body: JSON.stringify({ message: "Erro ao inserir usuário!" }),
      };
    }
  }
};

const validate = (schema) => {
  return {
    before: async (handler) => {
      const { error, value } = schema.validate(handler.event.body, {
        abortEarly: false,
      });

      if (error) {
        console.debug("Validation error: ", error);
        handler.response = {
          statusCode: 400,
          body: JSON.stringify({
            message: "Validation error",
            details: error.details.map((x) => x.message),
          }),
        };
        throw new Error("Validation error");
      }
      handler.event.body = value; // Ensure we use the validated value
    },
  };
};

const registerHandler = middy(register)
  .use(jsonBodyParser()) // Parse JSON body
  .use(validate(userSchema)); // Apply custom celebrate validation middleware

module.exports.register = registerHandler;
