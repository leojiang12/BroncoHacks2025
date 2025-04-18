// server/src/config/passport.js
require('dotenv').config();

const passport       = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const db             = require('../db');
const jwt            = require('jsonwebtoken');
const { jwtSecret, serverUrl } = require('../config/env');

// Ensure your .env has these set
const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } = process.env;
if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
  throw new Error(
    'Missing Google OAuth config. ' +
    'Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in your .env'
  );
}

passport.use(new GoogleStrategy({
    clientID:     GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL:  `${serverUrl}/api/auth/google/callback`,
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const googleId = profile.id;
      const email    = profile.emails?.[0]?.value;

      // 1) Find existing user by google_id or email
      const { rows } = await db.query(
        'SELECT * FROM users WHERE google_id=$1 OR email=$2',
        [googleId, email]
      );
      let user = rows[0];

      // 2) If new, insert and mark email_verified
      if (!user) {
        const insert = await db.query(
          `INSERT INTO users
             (username, email, google_id, email_verified)
           VALUES ($1,$2,$3,true)
           RETURNING *`,
          [profile.displayName, email, googleId]
        );
        user = insert.rows[0];
      }

      // 3) Sign a JWT for your client
      const token = jwt.sign(
        { userId: user.id },
        jwtSecret,
        { expiresIn: '1h' }
      );

      // 4) Pass the token through done()
      done(null, token);
    } catch (err) {
      done(err);
    }
  }
));
