// server/db/index.js
// Run this _after_ you've placed your .env file
require('dotenv').config();

const { Pool } = require('pg');
const { dbUrl } = require('../config/env');

const pool = new Pool({ connectionString: dbUrl });

module.exports = {
  query: (text, params) => pool.query(text, params),
  // you can also expose pool if you need client pooling directly
};
