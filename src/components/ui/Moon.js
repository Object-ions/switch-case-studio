import { Suspense, useRef, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF, Html, Center } from "@react-three/drei";
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

export default function Moon() {
  // The whole R3F <Canvas> is client-gated: the SSG render must never start
  // the WebGL/loader machinery (useGLTF.preload at module scope fired a GLTF
  // fetch at import time in Node — moved into the mount effect below). The
  // moon is decorative; static HTML ships an empty slot of the same size.
  const [mounted, setMounted] = useState(false);
  // OrbitControls mounts on fine-pointer devices ONLY (mobile audit M4):
  // three's OrbitControls sets touch-action:none on the canvas, so on phones
  // a one-finger swipe over this full-width 300px block rotated the moon
  // instead of scrolling the page — a scroll trap. Touch gets the decorative
  // auto-rotation with native scrolling.
  const [fineControls, setFineControls] = useState(false);
  useEffect(() => {
    useGLTF.preload("/models/moon.glb");
    setMounted(true);
    setFineControls(
      window.matchMedia("(hover: hover) and (pointer: fine)").matches,
    );
  }, []);

  if (!mounted) return <div style={{ width: "100%", height: "100%" }} />;

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <Canvas camera={{ position: [0, 0, CAM_DIST], fov: FOV }} dpr={[1, 2]}>
        <Suspense fallback={<Html center>Loading…</Html>}>
          {/* Sculpted lighting (mobile audit M4): the old ambient 0.6 +
              white directional + full HDRI Environment lit the sphere evenly
              from every direction — no shadow side, so it read as a flat
              grey disc. The HDRI (1.5MB fetch) is gone; a single off-axis
              key gives the moon a terminator, the lilac rim separates the
              dark limb from the black page, and the faint fill keeps the
              shadow side from going pure black. */}
          <ambientLight intensity={0.3} />
          <directionalLight
            intensity={7}
            position={[5, 2, 4]}
            color="#fff3e4"
          />
          <directionalLight
            intensity={2}
            position={[-6, 1, -4]}
            color="#dab8ff"
          />

          {/* Center ensures the model sits at the origin */}
          <Center>
            <MoonModel scale={MODEL_SCALE} />
          </Center>

          {/* Controls aimed at model center — no zoom (the wheel hijacked
              page scroll on desktop), no pan. */}
          {fineControls && (
            <OrbitControls
              enableDamping
              enableZoom={false}
              enablePan={false}
              target={[0, 0, 0]}
            />
          )}
        </Suspense>
      </Canvas>
    </div>
  );
}
