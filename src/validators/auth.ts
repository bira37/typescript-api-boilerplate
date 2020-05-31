import Joi from "@hapi/joi";

export const loginSchema = Joi.object().keys({
  username: Joi.string().min(4).required(),
  password: Joi.string().min(4).required()
});
