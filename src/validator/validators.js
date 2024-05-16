const Joi = require("joi");
const { errorHandler } = require("../utils/responseHandler");

const Validators = {
  validUsers: Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
  }),
  validTask: Joi.object({
    subject: Joi.string().required(),
    status: Joi.string().valid("Pending", "Completed"),
    deadline: Joi.date().required(),
  }),
  validUpdateTask: Joi.object({
    subject: Joi.string(),
    status: Joi.string(),
    deadline: Joi.date(),
  }),
  validSubTask: Joi.object({
    subTasks: Joi.array()
      .items({
        subject: Joi.string().required(),
        status: Joi.string().valid("Pending", "Completed"),
        deadline: Joi.date().required(),
        isActive: Joi.boolean().required(),
        _id: Joi.string(),
      })
      .required(),
  }),
};

module.exports = Validators;

function Validator(func) {
  return async function Validator(req, res, next) {
    try {
      const validated = await Validators[func].validateAsync(req.body, {
        abortEarly: false,
      });
      req.body = validated;
      next();
    } catch (err) {
      let _er = {};
      if (err.isJoi) {
        err.details.forEach((d) => {
          let _key = d.context.key;
          _er[_key] = d.message;
        });
      }
      await next(
        errorHandler({
          res,
          statusCode: 400,
          message: _er,
        })
      );
    }
  };
}

module.exports = Validator;
