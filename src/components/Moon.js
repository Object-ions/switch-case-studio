import { Suspense, useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  useGLTF,
  Environment,
  Html,
  Center,
} from "@react-three/drei";
import * as THREE from "three";

const MODEL_SCALE = 0.35; // smaller model
const CAM_DIST = 6; // camera distance (z)
const FOV = 35; // narrower FOV

function MoonModel(props) {
  const { scene } = useGLTF("/models/moon.glb");
  const ref = useRef();

  // Slow rotation
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.1;
  });

  // Preserve original textures but tint them by multiplying with color
  useEffect(() => {
    const tint = new THREE.Color("#f0d7ff");
    scene.traverse((child) => {
      if (child.isMesh && child.material) {
        const m = child.material;
        if (m.color) m.color.copy(tint); // multiplies with map if present
        if ("roughness" in m) m.roughness = 0.9;
        if ("metalness" in m) m.metalness = 0.1;
        m.needsUpdate = true;
      }
    });
  }, [scene]);

  return (
    <group ref={ref} {...props} dispose={null}>
      <primitive object={scene} />
    </group>
  );
}

useGLTF.preload("/models/moon.glb");

export default function Moon() {
  return (
    <div style={{ width: "100%", height: "500px" }}>
      <Canvas camera={{ position: [0, 0, CAM_DIST], fov: FOV }} dpr={[1, 2]}>
        <Suspense fallback={<Html center>Loading…</Html>}>
          {/* Base lighting */}
          <ambientLight intensity={0.6} />
          {/* Lilac directional light for extra wash */}
          <directionalLight intensity={1} position={[2, 3, 2]} color="#fff" />

          {/* Center ensures the model sits at the origin */}
          <Center>
            <MoonModel scale={MODEL_SCALE} />
          </Center>

          {/* Image-based lighting */}
          <Environment preset="city" />

          {/* Controls aimed at model center */}
          <OrbitControls
            enableDamping
            target={[0, 0, 0]}
            minDistance={CAM_DIST * 0.6}
            maxDistance={CAM_DIST * 2}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
