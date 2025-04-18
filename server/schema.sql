-- Drop existing table (if you're resetting completely)
DROP TABLE IF EXISTS users CASCADE;

-- Create the new users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username TEXT        UNIQUE NOT NULL,
  email    VARCHAR(255) UNIQUE NOT NULL,
  -- stored bcrypt hash
  password_hash TEXT    NOT NULL,
  -- email verification
  email_verified      BOOLEAN        NOT NULL DEFAULT FALSE,
  email_verification_token VARCHAR(255),
  -- optional Google OAuth link
  google_id           VARCHAR(255),
  -- audit timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Optional: update `updated_at` on every row modification
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_timestamp
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

-- Allow Google‑only users to have no password
ALTER TABLE users
  ALTER COLUMN password_hash DROP NOT NULL;
