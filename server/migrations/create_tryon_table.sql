-- migration: create a table for try-on sessions\
CREATE TABLE tryon_sessions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  raw_video_path TEXT NOT NULL,
  body_mesh_path TEXT,
  fitted_mesh_path TEXT,
  metrics JSONB,
  created_at TIMESTAMP DEFAULT now()
);