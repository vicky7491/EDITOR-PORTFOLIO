import { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Sphere, Stars } from '@react-three/drei';
import * as THREE from 'three';

// Floating abstract mesh
const AbstractOrb = ({ position, scale, speed, distort, color }) => {
  const meshRef = useRef();

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x = clock.getElapsedTime() * speed * 0.3;
    meshRef.current.rotation.y = clock.getElapsedTime() * speed * 0.2;
  });

  return (
    <Float speed={speed} rotationIntensity={0.4} floatIntensity={1.2}>
      <Sphere ref={meshRef} args={[1, 64, 64]} position={position} scale={scale}>
        <MeshDistortMaterial
          color={color}
          attach="material"
          distort={distort}
          speed={2}
          roughness={0.1}
          metalness={0.8}
          transparent
          opacity={0.7}
        />
      </Sphere>
    </Float>
  );
};

// Particle field
const ParticleField = ({ count = 800 }) => {
  const meshRef = useRef();

  const [positions, colors] = useMemo(() => {
    const pos  = new Float32Array(count * 3);
    const cols = new Float32Array(count * 3);
    const color = new THREE.Color();

    for (let i = 0; i < count; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20;

      const t = Math.random();
      color.setHSL(0.72 + t * 0.1, 0.8, 0.5 + t * 0.3); // purple range
      cols[i * 3]     = color.r;
      cols[i * 3 + 1] = color.g;
      cols[i * 3 + 2] = color.b;
    }
    return [pos, cols];
  }, [count]);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y = clock.getElapsedTime() * 0.03;
    meshRef.current.rotation.x = clock.getElapsedTime() * 0.01;
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color"    args={[colors,    3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        vertexColors
        transparent
        opacity={0.7}
        sizeAttenuation
      />
    </points>
  );
};

// Camera follows mouse subtly
const CameraRig = () => {
  const { camera, mouse } = useThree();
  useFrame(() => {
    camera.position.x += (mouse.x * 0.8 - camera.position.x) * 0.04;
    camera.position.y += (mouse.y * 0.5 - camera.position.y) * 0.04;
    camera.lookAt(0, 0, 0);
  });
  return null;
};

const HeroScene = () => {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 60 }}
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 1.5]}
      style={{ position: 'absolute', inset: 0 }}
    >
      <CameraRig />

      {/* Ambient + directional light */}
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]}   intensity={1.5} color="#a78bfa" />
      <directionalLight position={[-5, -3, -5]} intensity={0.5} color="#60a5fa" />
      <pointLight       position={[0, 0, 3]}    intensity={2}   color="#8b5cf6" distance={10}/>

      {/* Stars background */}
      <Stars radius={60} depth={50} count={2000} factor={3} fade speed={0.5}/>

      {/* Floating orbs */}
      <AbstractOrb position={[-2.5, 0.5,  0]} scale={1.4} speed={1.2} distort={0.5} color="#7c3aed"/>
      <AbstractOrb position={[ 2.5, -0.5, 0]} scale={1.0} speed={0.8} distort={0.4} color="#4f46e5"/>
      <AbstractOrb position={[ 0,   1.8, -2]} scale={0.6} speed={1.5} distort={0.6} color="#a78bfa"/>
      <AbstractOrb position={[-1,  -1.8, -1]} scale={0.4} speed={2.0} distort={0.7} color="#6d28d9"/>

      {/* Particles */}
      <ParticleField count={600} />
    </Canvas>
  );
};

export default HeroScene;