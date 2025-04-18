const { Pool } = require('pg');
const { dbUrl } = require('../config/default');
const pool = new Pool({ connectionString: dbUrl });

module.exports = {
  query: (text, params) => pool.query(text, params),
};
