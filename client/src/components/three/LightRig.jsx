// Reusable lighting setup for Three.js scenes

const LightRig = ({
  ambientIntensity   = 0.5,
  primaryColor       = '#8b5cf6',
  primaryIntensity   = 0.8,
  primaryPosition    = [5, 5, 5],
  secondaryColor     = '#06b6d4',
  secondaryIntensity = 0.5,
  secondaryPosition  = [-5, -5, -5],
  pointLights        = [],
}) => {
  return (
    <>
      <ambientLight intensity={ambientIntensity}/>

      <directionalLight
        position={primaryPosition}
        intensity={primaryIntensity}
        color={primaryColor}
      />

      <directionalLight
        position={secondaryPosition}
        intensity={secondaryIntensity}
        color={secondaryColor}
      />

      {/* Extra point lights */}
      {pointLights.map((light, i) => (
        <pointLight
          key={i}
          position={light.position || [0, 0, 0]}
          intensity={light.intensity || 0.5}
          color={light.color || '#ffffff'}
          distance={light.distance || 10}
          decay={light.decay || 2}
        />
      ))}
    </>
  );
};

export default LightRig;