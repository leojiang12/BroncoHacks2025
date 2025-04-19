import trimesh
import numpy as np

def shrinkwrap_mesh(body_path, garment_path, out_path, offset=0.005):
    body = trimesh.load(body_path)
    cloth = trimesh.load(garment_path)

    # For each cloth vertex, shoot a ray along its normal to find the body surface
    locations = []
    for v, n in zip(cloth.vertices, cloth.vertex_normals):
        ray_orig = v + n * 0.1
        ray_dir = -n
        loc, idx, _ = body.ray.intersects_location([
            ray_orig.tolist()], [ray_dir.tolist()])
        if len(loc):
            closest = loc[np.argmin(np.linalg.norm(loc - ray_orig, axis=1))]
            locations.append(closest + n * offset)
        else:
            locations.append(v)

    cloth.vertices = np.array(locations)
    cloth.export(out_path)

    # Simple metric: max penetration (negative distances)
    dists = cloth.nearest.signed_distance(body)
    return {
        'max_penetration_cm': float(min(dists)) * 100,
        'mean_gap_cm': float(np.mean(dists[dists>0])) * 100
    }