const bcrypt = require('bcrypt');
const jwt    = require('jsonwebtoken');
const { z }  = require('zod');
const { jwtSecret } = require('../config/env');
const db            = require('../db');

const registerSchema = z.object({
  email:    z.string().email(),
  username: z.string().min(3),
  password: z.string().min(6),
});

exports.register = async (req, res, next) => {
  // DEBUG: raw vs parsed
  console.log('🧩 rawBody      :', req.rawBody);
  console.log('🧩 parsed body :', req.body);

  try {
    // Parse & validate
    const { email, username, password } = registerSchema.parse(req.body);
    console.log('🛠️ register got:', { email, username, password });

    // Hash & insert
    const hash = await bcrypt.hash(password, 10);
    const { rows } = await db.query(
      `INSERT INTO users (email, username, password_hash)
       VALUES ($1, $2, $3)
       RETURNING id, email, username`,
      [email, username, hash]
    );

    // Issue JWT
    const token = jwt.sign({ userId: rows[0].id }, jwtSecret, {
      expiresIn: '1h'
    });
    res.status(201).json({ token });
  } catch (err) {
    if (err.name === 'ZodError') {
      return res
        .status(400)
        .json({ message: err.errors.map(e => e.message).join(', ') });
    }
    next(err);
  }
};

exports.login = async (req, res, next) => {
  console.log('🧩 login rawBody      :', req.rawBody);
  console.log('🧩 login parsed body :', req.body);
  try {
    const { email, password } = req.body;
    const user = await db.query(
      `SELECT id, password_hash FROM users WHERE email = $1`,
      [email]
    ).then(r => r.rows[0]);

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user.id }, jwtSecret, {
      expiresIn: '1h'
    });
    res.json({ token });
  } catch (err) {
    next(err);
  }
};
