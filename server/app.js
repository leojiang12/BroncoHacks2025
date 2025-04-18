require('dotenv').config();

const express      = require('express');
const path         = require('path');
const cookieParser = require('cookie-parser');
const logger       = require('morgan');
const cors         = require('cors');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const authRoutes  = require('./routes/auth');
const authGuard   = require('./src/middleware/auth');

const app = express();

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Auth API
app.use('/api/auth', authRoutes);

// Protected test endpoint
app.get('/api/me', authGuard, (req, res) => {
  res.json({ userId: req.userId });
});

// Existing pages
app.use('/', indexRouter);
app.use('/users', usersRouter);

module.exports = app;
