"use client";

import React, { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Environment } from "@react-three/drei";

function LogoModel() {
  const ref = useRef(null);
  const { scene } = useGLTF("/models/Logo.gltf");
  const [hovered, setHovered] = useState(false);

  useFrame(() => {
    if (!ref.current) return;
    // smooth, subtle rotation when hovered
    if (hovered) {
      ref.current.rotation.y += (0.4 - ref.current.rotation.y) * 0.05;
    } else {
      // return slowly to neutral position
      ref.current.rotation.y += (0 - ref.current.rotation.y) * 0.05;
    }
  });

  return (
    <primitive
      ref={ref}
      object={scene}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      scale={2.5}
      position={[0, -0.5, 0]}
    />
  );
}

export default function LogoDisplay() {
  return (
    <div className="w-full h-90">
      <Canvas camera={{ position: [0, 0.5, 1], fov: 40 }}>
        <ambientLight intensity={0.8} />
        <directionalLight position={[5, 5, 7.5]} intensity={0.5} />
        <Environment preset="studio" />
        <LogoModel />
      </Canvas>
    </div>
  );
}
