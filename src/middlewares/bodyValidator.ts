import Joi from "@hapi/joi";

/**
 * Validates the body of a request before reaching the controller
 * @param validator a Joi Schema Validator
 */
export function bodyValidator(validator: Joi.Schema) {
  return async function (req: any, res: any, next: any) {
    try {
      const { error } = validator.validate(req.body);
      if (error) {
        throw new Error(`${error}`);
      }
      next();
    } catch (err) {
      res.status(400).send({ data: { error: err.message } });
    }
  };
}
