// server/app.js

// 1. Load .env early
require('dotenv').config();

const express      = require('express');
const path         = require('path');
const cookieParser = require('cookie-parser');
const logger       = require('morgan');
const cors         = require('cors');

// 2. Existing generators’ routes
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

// 3. Your auth route + middleware
const authRoutes     = require('./src/routes/auth');
const authMiddleware = require('./src/middleware/auth');

const app = express();

// 4. Global middleware
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// 5. Mount your Auth API
app.use('/api/auth', authRoutes);

// 6. Example protected endpoint
app.get('/api/me', authMiddleware, (req, res) => {
  res.json({ userId: req.userId });
});

// 7. Mount the rest of your routes
app.use('/', indexRouter);
app.use('/users', usersRouter);

module.exports = app;
