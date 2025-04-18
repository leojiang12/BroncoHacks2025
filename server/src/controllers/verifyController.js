const db = require('../db');

exports.verifyEmail = async (req, res) => {
  const { token } = req.query;
  const { rowCount } = await db.query(
    `UPDATE users
     SET email_verified = true, email_token = NULL
     WHERE email_token = $1`,
    [token]
  );
  if (!rowCount) return res.status(400).send('Invalid or expired token');
  res.redirect(`${process.env.CLIENT_URL}/login?verified=1`);
};
