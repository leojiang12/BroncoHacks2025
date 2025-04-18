// server/middleware/rateLimiter.js
const rateLimit = require('express-rate-limit');

module.exports = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 20,                   // limit each IP to 20 requests per window
  message: { error: 'Too many requests, please try again later.' },
});
