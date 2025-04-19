// server/routes/tryon.js

const express = require('express');
const multer = require('multer');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const authGuard = require('../src/middleware/auth');
const db = require('../src/db');

const router = express.Router();

// Multer storage: saves under uploads/<userId>/pending/raw.mp4
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const userId = req.userId;
    if (!userId) return cb(new Error('Unauthorized'), null);
    const sessionDir = path.join(__dirname, '../uploads', String(userId), 'pending');
    fs.mkdirSync(sessionDir, { recursive: true });
    cb(null, sessionDir);
  },
  filename: (_, file, cb) => cb(null, 'raw.mp4')
});
const upload = multer({ storage });

// 1) Upload raw video (protected route)
router.post(
  '/upload',
  authGuard,               // ensure req.userId is set
  upload.single('video'),  // multer handles the file
  async (req, res, next) => {
    try {
      const userId = req.userId;
      // insert a new session in the DB
      const session = await db.query(
        `INSERT INTO tryon_sessions (user_id, raw_video_path)
         VALUES ($1, $2) RETURNING id`,
        [userId, req.file.path]
      );
      const sessionId = session.rows[0].id;

      // run the Python pipeline in the background
      const worker = spawn('python3', [
        'inference/pipeline.py',
        req.file.path,
        String(userId),
        String(sessionId)
      ]);
      worker.stdout.on('data', data => console.log(data.toString()));
      worker.stderr.on('data', data => console.error(data.toString()));

      // respond immediately with the new session ID
      res.json({ sessionId });
    } catch (err) {
      next(err);
    }
  }
);

// 2) Fetch results for a session
router.get('/:id', async (req, res, next) => {
  res.set({
    'Cache-Control': 'no-store, max-age=0',
     Pragma: 'no-cache',
  });
  try {
    const { id } = req.params;
    const result = await db.query(
      `SELECT
         body_mesh_path   AS "body_mesh_path",
         fitted_mesh_path AS "fitted_mesh_path",
         metrics
       FROM tryon_sessions
       WHERE id = $1`,
      [id]
    );
    if (!result.rows.length) {
      return res.status(404).json({ error: 'Session not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
