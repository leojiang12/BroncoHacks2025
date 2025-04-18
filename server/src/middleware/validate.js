// server/middleware/validate.js
const Joi = require('joi');

module.exports = (schema) => (req, res, next) => {
  const result = schema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true      // removes any extra fields
  });
  if (result.error) {
    return res.status(400).json({
      error: 'Validation failed',
      details: result.error.details.map((d) => d.message),
    });
  }
  req.body = result.value;  // sanitized
  next();
};
