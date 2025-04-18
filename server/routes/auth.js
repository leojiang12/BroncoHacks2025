// server/routes/auth.js
const router = require('express').Router();
const { register, login } = require('../src/controllers/authController');
const validate   = require('../src/middleware/validate');
const rateLimiter = require('../src/middleware/rateLimiter');  // see next section
const Joi        = require('joi');
const { verifyEmail } = require('../src/controllers/verifyController');


// Define schemas
const registerSchema = Joi.object({
      email:    Joi.string().email().required(),           // ← add this
      username: Joi.string().alphanum().min(3).required(),
      password: Joi.string().min(6).required(),
    });

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

// Apply middlewares: rate-limit → validation → controller
router.post(
  '/register',
  rateLimiter,
  validate(registerSchema),
  register
);

router.post(
  '/login',
  rateLimiter,
  validate(loginSchema),
  login
);

router.get('/verify', verifyEmail);

module.exports = router;
