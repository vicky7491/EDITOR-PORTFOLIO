// Animated distorted sphere — used in hero and section backgrounds

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Sphere } from '@react-three/drei';

const AbstractShape = ({
  position   = [0, 0, 0],
  scale      = 1,
  color      = '#8b5cf6',
  speed      = 1,
  distort    = 0.45,
  opacity    = 0.15,
  metalness  = 0.3,
  roughness  = 0,
  floatSpeed = 2,
  floatIntensity = 1.5,
}) => {
  const meshRef = useRef();

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x =
      Math.sin(state.clock.elapsedTime * speed * 0.3) * 0.3;
    meshRef.current.rotation.y = state.clock.elapsedTime * speed * 0.2;
  });

  return (
    <Float
      speed={floatSpeed}
      rotationIntensity={0.4}
      floatIntensity={floatIntensity}
    >
      <mesh ref={meshRef} position={position} scale={scale}>
        <Sphere args={[1, 64, 64]}>
          <MeshDistortMaterial
            color={color}
            distort={distort}
            speed={2}
            roughness={roughness}
            metalness={metalness}
            transparent
            opacity={opacity}
          />
        </Sphere>
      </mesh>
    </Float>
  );
};

export default AbstractShape;