import Joi from "joi";

const emailRegexp = /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/;

const registerUserSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).message("Invalid email").required(),
  password: Joi.string().min(8).required(),
});

const loginUserSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).message("Invalid email").required(),
  password: Joi.string().required(),
});

const updateSubscriptionSchema = Joi.object({
  subscription: Joi.string()
    .valid("starter", "pro", "business")
    .only()
    .required(),
});

const verifyUserSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required(),
});

export default {
  registerUserSchema,
  loginUserSchema,
  updateSubscriptionSchema,
  verifyUserSchema,
};
