import sys, os
import subprocess
import json
import trimesh
import numpy as np
from shrinkwrap import shrinkwrap_mesh  # see next script

# args: raw_video_path, user_id, session_id
raw_video, user_id, session_id = sys.argv[1:4]
out_dir = f"uploads/{user_id}/{session_id}"
frames_dir = os.path.join(out_dir, 'frames')

os.makedirs(frames_dir, exist_ok=True)

# 1) Extract frames
subprocess.run([
    'ffmpeg', '-i', raw_video,
    '-vf', 'fps=2', os.path.join(frames_dir, 'frame_%03d.png')
])

# 2) Run PIFuHD body reconstruction\# assumes pifuhd code is in the PYTHONPATH
from pifuhd.run import reconstruct
body_mesh = os.path.join(out_dir, 'body_mesh.glb')
reconstruct(
    image_folder=frames_dir,
    out_file=body_mesh,
    use_gpu=True
)

# 3) Shrink-wrap garment mesh onto body
garment_mesh = 'data/garments/sample_shirt.glb'
fitted = os.path.join(out_dir, 'fitted_mesh.glb')

bw_metrics = shrinkwrap_mesh(body_mesh, garment_mesh, fitted)

# 4) Save metrics & update DB
db_conn = subprocess.Popen([
    'psql', '-U', 'myuser', '-d', 'mydb', '-c',
    f"UPDATE tryon_sessions SET body_mesh_path='{body_mesh}', fitted_mesh_path='{fitted}', metrics='{json.dumps(bw_metrics)}' WHERE id={session_id};"
])

db_conn.wait()