import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { MeshDistortMaterial, Sphere, Stars, Float } from '@react-three/drei';
import { useMotionValue, useSpring } from 'framer-motion';
import * as THREE from 'three';

// ── Camera rig that follows mouse ─────────────────────────────────────────────
const CameraRig = ({ mouseX, mouseY }) => {
  const { camera } = useThree();
  const targetX    = useRef(0);
  const targetY    = useRef(0);

  useFrame(() => {
    targetX.current = mouseX.get() * 1.5;
    targetY.current = mouseY.get() * 1.0;

    camera.position.x += (targetX.current - camera.position.x) * 0.04;
    camera.position.y += (-targetY.current - camera.position.y) * 0.04;
    camera.lookAt(0, 0, 0);
  });

  return null;
};

// ── Floating distorted blob ───────────────────────────────────────────────────
const Blob = ({ position, scale, color, speed, distort, opacity }) => {
  const mesh = useRef();

  useFrame(({ clock }) => {
    if (!mesh.current) return;
    mesh.current.rotation.x = Math.sin(clock.elapsedTime * speed * 0.4) * 0.3;
    mesh.current.rotation.y = clock.elapsedTime * speed * 0.2;
  });

  return (
    <Float speed={speed} rotationIntensity={0.3} floatIntensity={1.5}>
      <mesh ref={mesh} position={position} scale={scale}>
        <Sphere args={[1, 64, 64]}>
          <MeshDistortMaterial
            color={color}
            distort={distort}
            speed={2}
            roughness={0}
            metalness={0.4}
            transparent
            opacity={opacity}
          />
        </Sphere>
      </mesh>
    </Float>
  );
};

// ── Wireframe rotating torus ──────────────────────────────────────────────────
const WireTorus = ({ radius, tube, color, speed }) => {
  const mesh = useRef();
  useFrame(({ clock }) => {
    if (!mesh.current) return;
    mesh.current.rotation.x = clock.elapsedTime * speed * 0.4;
    mesh.current.rotation.y = clock.elapsedTime * speed * 0.2;
    mesh.current.rotation.z = clock.elapsedTime * speed * 0.1;
  });
  return (
    <mesh ref={mesh}>
      <torusGeometry args={[radius, tube, 16, 80]}/>
      <meshBasicMaterial color={color} wireframe transparent opacity={0.15}/>
    </mesh>
  );
};

// ── Grid plane ────────────────────────────────────────────────────────────────
const GridPlane = () => {
  const grid = useRef();
  useFrame(({ clock }) => {
    if (!grid.current) return;
    // Slowly drift the grid for depth
    grid.current.position.z = (clock.elapsedTime * 0.3) % 2;
  });
  return (
    <gridHelper
      ref={grid}
      args={[40, 40, '#1a1a40', '#1a1a40']}
      position={[0, -4, 0]}
      rotation={[0, 0, 0]}
    />
  );
};

// ── Particle field ────────────────────────────────────────────────────────────
const Particles = ({ count = 700, spread = 22 }) => {
  const points = useRef();
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3]     = (Math.random() - 0.5) * spread;
      arr[i * 3 + 1] = (Math.random() - 0.5) * spread;
      arr[i * 3 + 2] = (Math.random() - 0.5) * spread;
    }
    return arr;
  }, [count, spread]);

  useFrame(({ clock }) => {
    if (!points.current) return;
    points.current.rotation.y = clock.elapsedTime * 0.018;
    points.current.rotation.x = Math.sin(clock.elapsedTime * 0.01) * 0.05;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.022}
        color="#8b5cf6"
        transparent
        opacity={0.55}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
};

// ── Main scene ────────────────────────────────────────────────────────────────
const Scene = ({ mouseX, mouseY }) => {
  return (
    <>
      <CameraRig mouseX={mouseX} mouseY={mouseY}/>

      {/* Lighting */}
      <ambientLight intensity={0.4}/>
      <directionalLight position={[5,  5, 5]}  intensity={1}   color="#8b5cf6"/>
      <directionalLight position={[-5,-5,-5]}  intensity={0.6} color="#06b6d4"/>
      <pointLight       position={[0,  3, 2]}  intensity={0.8} color="#7c3aed" distance={12}/>

      <Stars radius={90} depth={60} count={4000} factor={3} saturation={0} fade speed={0.5}/>
      <Particles/>
      <GridPlane/>

      <WireTorus radius={3.8} tube={0.018} color="#8b5cf6" speed={0.6}/>
      <WireTorus radius={5.2} tube={0.012} color="#06b6d4" speed={0.3}/>

      <Blob position={[-3.5,  1.5, -2]} scale={2.2} color="#8b5cf6" speed={0.8} distort={0.45} opacity={0.18}/>
      <Blob position={[ 3.5, -1.0, -3]} scale={1.8} color="#06b6d4" speed={1.2} distort={0.5}  opacity={0.14}/>
      <Blob position={[ 0,    0,   -5]} scale={3.2} color="#7c3aed" speed={0.5} distort={0.35} opacity={0.1}/>
    </>
  );
};

// ── Export ────────────────────────────────────────────────────────────────────
const HeroScene = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const smoothX = useSpring(mouseX, { stiffness: 60, damping: 20 });
  const smoothY = useSpring(mouseY, { stiffness: 60, damping: 20 });

  useEffect(() => {
    const onMove = (e) => {
      mouseX.set((e.clientX / window.innerWidth  - 0.5) * 2);
      mouseY.set((e.clientY / window.innerHeight - 0.5) * 2);
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, [mouseX, mouseY]);

  return (
    <Canvas
      camera={{ position: [0, 0, 9], fov: 55 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      dpr={[1, 1.5]}
      style={{ position: 'absolute', inset: 0 }}
    >
      <Scene mouseX={smoothX} mouseY={smoothY}/>
    </Canvas>
  );
};

export default HeroScene;