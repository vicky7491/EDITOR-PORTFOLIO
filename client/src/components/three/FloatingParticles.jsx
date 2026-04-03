// Standalone particle field — can be used outside HeroScene

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';

const FloatingParticles = ({
  count   = 500,
  spread  = 20,
  size    = 0.025,
  color   = '#8b5cf6',
  speed   = 0.02,
  opacity = 0.6,
}) => {
  const pointsRef = useRef();

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * spread;
      pos[i * 3 + 1] = (Math.random() - 0.5) * spread;
      pos[i * 3 + 2] = (Math.random() - 0.5) * spread;
    }
    return pos;
  }, [count, spread]);

  useFrame((state) => {
    if (!pointsRef.current) return;
    pointsRef.current.rotation.y  = state.clock.elapsedTime * speed;
    pointsRef.current.rotation.x  = state.clock.elapsedTime * speed * 0.3;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={size}
        color={color}
        transparent
        opacity={opacity}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
};

export default FloatingParticles;