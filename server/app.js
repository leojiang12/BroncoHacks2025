require('dotenv').config();

const express      = require('express');
const helmet       = require('helmet');
const path         = require('path');
const cookieParser = require('cookie-parser');
const pinoLogger   = require('express-pino-logger');
const cors         = require('cors');
const passport     = require('passport');

require('./src/config/passport');  // GoogleStrategy

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const authRoutes  = require('./routes/auth');
const authGuard   = require('./src/middleware/auth');
const db           = require('./src/db');

const app = express();

// ─── BODY PARSING w/ RAW BUFFER CAPTURE ───────────────────────────────
app.use(express.json({
  verify: (req, res, buf) => { req.rawBody = buf.toString('utf8'); }
}));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// ─── LOGGING & SECURITY ────────────────────────────────────────────────
app.use(helmet());
app.use(pinoLogger({
  transport: { target: 'pino-pretty', options: { colorize: true } }
}));

// ─── CORS ──────────────────────────────────────────────────────────────
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';
const corsOptions = {
  origin: CLIENT_URL,
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type','Authorization']
};
app.options('*', cors(corsOptions));
app.use(cors(corsOptions));

// ─── AUTH + OAUTH ROUTES ───────────────────────────────────────────────
app.use('/api/auth', authRoutes);

app.use(passport.initialize());
app.get(
  '/api/auth/google',
  passport.authenticate('google', { scope: ['profile','email'] })
);
app.get(
  '/api/auth/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/login' }),
  (req, res) => {
    res.redirect(`${process.env.CLIENT_URL}/oauth2/redirect?token=${req.user}`);
  }
);

// ─── PROTECTED USER ROUTE ──────────────────────────────────────────────
app.get('/api/me', authGuard, async (req, res, next) => {
  try {
    const { rows } = await db.query(
      `SELECT id, username FROM users WHERE id = $1`,
      [req.userId]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ userId: rows[0].id, username: rows[0].username });
  } catch (err) {
    next(err);
  }
});

// ─── OTHER ROUTES & STATIC ─────────────────────────────────────────────
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use(express.static(path.join(__dirname, 'public')));

// ─── FALLBACK / ERROR HANDLING ────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: `Path ${req.originalUrl} not found` });
});
app.use((err, req, res, next) => {
  req.log.error(err);
  res.status(err.status || 500).json({ error: err.message });
});

// serve uploads statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// mount our try‑on routes
app.use('/api/tryon', require('./routes/tryon'));

module.exports = app;
