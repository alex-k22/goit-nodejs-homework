import Joi from "joi";

const movieAddSchema = Joi.object({
    name: Joi.string().required().messages({
      'any.required': 'missing required name field'
    }),
    email: Joi.string().email().required().messages({
      'any.required': 'missing required email field'
    }),
    phone: Joi.string().required().messages({
      'any.required': 'missing required phone field'
    }),
  });

  export default {
    movieAddSchema,
  }