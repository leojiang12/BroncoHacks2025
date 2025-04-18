const db = require('../src/db');

async function findByUsername(username) {
  const res = await db.query(
    'SELECT id, username, password_hash FROM users WHERE username=$1',
    [username]
  );
  return res.rows[0];
}

async function createUser(username, passwordHash) {
  const res = await db.query(
    'INSERT INTO users (username, password_hash) VALUES ($1,$2) RETURNING id,username',
    [username, passwordHash]
  );
  return res.rows[0];
}

module.exports = { findByUsername, createUser };
