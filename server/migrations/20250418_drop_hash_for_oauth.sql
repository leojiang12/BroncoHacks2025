-- allow null passwords for OAuth accounts
ALTER TABLE users
  ALTER COLUMN password_hash DROP NOT NULL;
