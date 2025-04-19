const express = require('express');
const multer = require('multer');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const router = express.Router();

// 1. Upload raw video
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const { user } = req; // assume req.user.id set
    const sessionDir = path.join(__dirname, '../uploads', String(user.id), 'pending');
    fs.mkdirSync(sessionDir, { recursive: true });
    cb(null, sessionDir);
  },
  filename: (_, file, cb) => cb(null, 'raw.mp4')
});
const upload = multer({ storage });

router.post('/upload', upload.single('video'), async (req, res) => {
  const { user } = req;
  // Insert DB record
  const session = await db.query(
    `INSERT INTO tryon_sessions (user_id, raw_video_path) VALUES ($1, $2) RETURNING id`,
    [user.id, req.file.path]
  );
  const sessionId = session.rows[0].id;

  // spawn the pipeline script
  const worker = spawn('python3', [
    'inference/pipeline.py',
    req.file.path,
    String(user.id),
    String(sessionId)
  ]);

  worker.stdout.on('data', data => console.log(data.toString()));
  worker.stderr.on('data', data => console.error(data.toString()));

  res.json({ sessionId });
});

// 2. Get results
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const result = await db.query(`SELECT body_mesh_path, fitted_mesh_path, metrics FROM tryon_sessions WHERE id=$1`, [id]);
  if (!result.rows.length) return res.status(404).send('Not found');
  res.json(result.rows[0]);
});

module.exports = router;