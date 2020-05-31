import Joi from "@hapi/joi";

export const createUserSchema = Joi.object().keys({
  username: Joi.string().min(4).required(),
  password: Joi.string().min(6).required(),
  email: Joi.string().email().required(),
  firstName: Joi.string().min(1).required(),
  lastName: Joi.string().min(1).required(),
  isSuperUser: Joi.boolean().required()
});
