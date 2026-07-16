import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, MeshTransmissionMaterial } from '@react-three/drei';

export default function HeroScene() {
  const meshRef1 = useRef();
  const meshRef2 = useRef();
  const meshRef3 = useRef();

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    if (meshRef1.current) {
      meshRef1.current.rotation.x = time * 0.2;
      meshRef1.current.rotation.y = time * 0.3;
    }
    if (meshRef2.current) {
      meshRef2.current.rotation.x = -time * 0.15;
      meshRef2.current.rotation.y = time * 0.25;
    }
    if (meshRef3.current) {
      meshRef3.current.rotation.x = time * 0.1;
      meshRef3.current.rotation.y = -time * 0.2;
    }
  });

  const materialProps = {
    backside: true,
    samples: 16,
    resolution: 512,
    transmission: 0.9,
    roughness: 0.1,
    clearcoat: 1,
    clearcoatRoughness: 0.1,
    thickness: 0.5,
    ior: 1.5,
    chromaticAberration: 0.05,
    anisotropy: 0.3,
    distortion: 0.2,
    distortionScale: 0.5,
    temporalDistortion: 0.1,
    color: '#ffffff',
  };

  return (
    <>
      <Float speed={1.5} rotationIntensity={1} floatIntensity={2}>
        <mesh ref={meshRef1} position={[0, 0, 0]}>
          <torusKnotGeometry args={[1, 0.3, 128, 32]} />
          <MeshTransmissionMaterial {...materialProps} />
        </mesh>
      </Float>

      <Float speed={2} rotationIntensity={1.5} floatIntensity={3}>
        <mesh ref={meshRef2} position={[-2.5, 1.5, -2]}>
          <icosahedronGeometry args={[0.8, 0]} />
          <MeshTransmissionMaterial {...materialProps} color="#a855f7" />
        </mesh>
      </Float>

      <Float speed={1} rotationIntensity={0.5} floatIntensity={1.5}>
        <mesh ref={meshRef3} position={[2.5, -1.5, -1]}>
          <sphereGeometry args={[1, 64, 64]} />
          <MeshTransmissionMaterial {...materialProps} color="#6366f1" />
        </mesh>
      </Float>
    </>
  );
}
