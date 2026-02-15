import Joi from "joi";

export const createUserSchema = Joi.object({
  firstName: Joi.string().trim().min(2).max(50).required(),

  lastName: Joi.string().trim().min(2).max(50).required(),

  email: Joi.string().email().lowercase().required(),

  password: Joi.string().min(6).required(),

  gender: Joi.string()
    .valid("male", "female", "other")
    .required(),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().lowercase().required(),

  password: Joi.string().required(),
});

