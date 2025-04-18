const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { findByUsername, createUser } = require('../../models/userModel');
const { jwtSecret } = require('../config/default');

exports.register = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ message: 'Username & password required' });

  if (await findByUsername(username))
    return res.status(409).json({ message: 'Username taken' });

  const hash = await bcrypt.hash(password, 10);
  const user = await createUser(username, hash);
  res.status(201).json(user);
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  const user = await findByUsername(username);
  if (!user || !(await bcrypt.compare(password, user.password_hash)))
    return res.status(401).json({ message: 'Invalid credentials' });

  const token = jwt.sign({ userId: user.id }, jwtSecret, { expiresIn: '1h' });
  res.json({ token });
};
