import React, { Suspense, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import api from '../services/api';

interface ResultData {
  fitted_mesh_path: string;
  metrics: Record<string, number>;
}

export function TryOnResult({ sessionId }: { sessionId: string }) {
  const [data, setData] = useState<ResultData | null>(null);

  useEffect(() => {
    if (!sessionId) return;  // guard against undefined
    api.get(`/tryon/${sessionId}`)
      .then(res => setData(res.data))
      .catch(err => console.warn('Failed fetching TryOnResult:', err));
  }, [sessionId]);

  if (!data) return <p>Loading result…</p>;
  const meshUrl = data.fitted_mesh_path.replace(/^uploads/, '/uploads');

  return (
    <div style={{ display: 'flex', marginTop: 16 }}>
      <div style={{ width: 360, height: 480 }}>
        <Canvas camera={{ position: [0, 1.6, 3] }}>
          <ambientLight intensity={0.7} />
          <directionalLight position={[5, 10, 5]} intensity={1} />
          <Suspense fallback={null}>
            <Model url={meshUrl} />
          </Suspense>
          <OrbitControls enablePan={false} />
        </Canvas>
      </div>
      <div style={{ marginLeft: 24 }}>
        <h3>Fit Metrics</h3>
        <ul>
          {Object.entries(data.metrics).map(([k, v]) => (
            <li key={k}>
              <strong>{k.replace(/_/g, ' ')}:</strong> {v.toFixed(2)} cm
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function Model({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} />;
}