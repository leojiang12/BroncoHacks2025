// server/models/userModel.js
const db = require('../src/db');

async function createUser({ username, email, passwordHash, emailVerified = false }) {
  const { rows } = await db.query(
    `INSERT INTO users
       (username, email, password_hash, email_verified)
     VALUES ($1,     $2,    $3,            $4)
     RETURNING id, username, email, email_verified, created_at, updated_at`,
    [username, email, passwordHash, emailVerified]
  );
  return rows[0];
}

async function findUserByUsername(username) {
  const { rows } = await db.query(
    `SELECT * FROM users WHERE username = $1`,
    [username]
  );
  return rows[0] || null;
}

module.exports = {
  createUser,
  findUserByUsername,
};
