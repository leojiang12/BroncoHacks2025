import React, { Suspense, useEffect, useState, useRef } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, Html, Center } from '@react-three/drei';
import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';

// Spinning model component with control for rotation speed
function SpinningObjModel({ url, rotationSpeed = 0.5 }: { url: string; rotationSpeed?: number }) {
  const [obj, setObj] = useState<THREE.Group | null>(null);
  const groupRef = useRef<THREE.Group>(null);
  const { camera } = useThree();

  // Handle the rotation animation
  useFrame(() => {
    if (groupRef.current) {
      // Rotate around the Y axis (vertical axis)
      groupRef.current.rotation.y += rotationSpeed * 0.01;
    }
  });

  useEffect(() => {
    console.log("📦 Loading OBJ from:", url);
    const loader = new OBJLoader();
    
    loader.load(
      url,
      (object) => {
        console.log("✅ OBJ loaded successfully:", object);
        
        // Add material to all meshes if they don't have one
        object.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            if (!child.material) {
              child.material = new THREE.MeshStandardMaterial({
                color: 0x888888,
                roughness: 0.5,
                metalness: 0.2
              });
            }
          }
        });
        
        // Calculate bounding box to analyze dimensions
        const box = new THREE.Box3().setFromObject(object);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());
        
        // Determine which axis is the "height" axis (usually the longest dimension)
        let heightAxis = 'y';
        if (size.x > size.y && size.x > size.z) heightAxis = 'x';
        if (size.z > size.y && size.z > size.x) heightAxis = 'z';
        
        console.log("📏 Model dimensions:", size);
        console.log("📏 Height axis determined to be:", heightAxis);
        
        // Reset position
        object.position.set(0, 0, 0);
        
        // Rotate the model to stand upright if needed
        if (heightAxis === 'x') {
          // If X is the height axis, rotate around Z to make X vertical
          object.rotation.z = -Math.PI / 2;
        } else if (heightAxis === 'z') {
          // If Z is the height axis, rotate around X to make Z vertical
          object.rotation.x = Math.PI / 2;
        }
        
        // Re-calculate bounding box after rotation
        const newBox = new THREE.Box3().setFromObject(object);
        const newCenter = newBox.getCenter(new THREE.Vector3());
        const maxDim = Math.max(newBox.max.x - newBox.min.x, 
                                newBox.max.z - newBox.min.z, 
                                newBox.max.y - newBox.min.y);
        const scale = 1 / maxDim;
        
        // Position the model so it stands on the "ground"
        object.position.set(
          -newCenter.x, 
          -newBox.min.y, // This ensures the bottom is at y=0
          -newCenter.z
        );
        
        // Scale the model to fit the scene
        object.scale.multiplyScalar(scale);
        
        setObj(object);
        
        // We're not setting camera position here anymore as it's handled in the main component
      },
      (xhr) => {
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
      },
      (err) => console.error('❌ Error loading OBJ model:', err)
    );
  }, [url]);

  return (
    <group ref={groupRef}>
      {obj ? <primitive object={obj} /> : null}
    </group>
  );
}

export default function MeshViewer({ 
  modelUrl, 
  rotationSpeed = 0.3 
}: { 
  modelUrl: string; 
  rotationSpeed?: number 
}) {
  return (
    <div style={{ height: '500px', width: '500px', backgroundColor: '#e0e0e0' }}>
      <Canvas
        camera={{ 
          position: [1.5, 1.2, 1.5],  // Positioned at an angle to see the model clearly
          fov: 45,                    // Narrower field of view for less distortion
          near: 0.1,
          far: 1000
        }}
      >
        {/* Light blue/gray background similar to screenshot */}
        <color attach="background" args={['#e6edf0']} />
        
        {/* Increased ambient light for better overall illumination */}
        <ambientLight intensity={1.5} color="#ffffff" />
        
        {/* Key light from the front-right */}
        <directionalLight 
          position={[5, 5, 5]} 
          intensity={1} 
          color="#ffffff"
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        
        {/* Fill light from the left */}
        <directionalLight 
          position={[-5, 3, 0]} 
          intensity={0.5} 
          color="#b0c4de"
        />
        
        {/* Top light for better definition */}
        <directionalLight 
          position={[0, 10, 0]} 
          intensity={0.8} 
          color="#ffffff"
        />
        
        <Suspense fallback={<Html center><div className="text-xl">Loading OBJ...</div></Html>}>
          <SpinningObjModel url={modelUrl} rotationSpeed={rotationSpeed} />
          <Environment preset="sunset" intensity={0.3} />
        </Suspense>
        
        {/* Light blue floor similar to screenshot */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
          <planeGeometry args={[20, 20]} />
          <meshStandardMaterial color="#d3e0e8" />
        </mesh>
        
        <OrbitControls 
          makeDefault
          target={[0, 1, 0]}  // Look at a point at approximately waist level
          minDistance={1}       // Don't allow zooming in too close
          maxDistance={10}      // Don't allow zooming out too far
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
        />
      </Canvas>
    </div>
  );
}