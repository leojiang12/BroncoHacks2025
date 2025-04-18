const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db');
const { jwtSecret } = require('../config/default');

exports.register = async (req, res) => {
  const { username, password } = req.body;
  // check existing
  const { rows } = await db.query(
    'SELECT 1 FROM users WHERE username = $1',
    [username]
  );
  if (rows.length) return res.status(409).json({ message: 'Username taken' });

  const hash = await bcrypt.hash(password, 10);
  const result = await db.query(
    'INSERT INTO users (username, password_hash) VALUES ($1,$2) RETURNING id, username',
    [username, hash]
  );
  res.status(201).json(result.rows[0]);
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  const { rows } = await db.query(
    'SELECT * FROM users WHERE username = $1',
    [username]
  );
  const user = rows[0];
  if (!user || !(await bcrypt.compare(password, user.password_hash)))
    return res.status(401).json({ message: 'Invalid credentials' });

  const token = jwt.sign({ userId: user.id }, jwtSecret, { expiresIn: '1h' });
  res.json({ token });
};
