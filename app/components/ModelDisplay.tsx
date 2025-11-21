"use client";

import React, { useRef } from "react";
import * as THREE from "three";
import { OrbitControls, useGLTF, Environment } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";

function BowlModel() {
  const ref = useRef<THREE.Group>(null);
  // const { scene } = useGLTF("/models/bowl.glb");
  const { scene } = useGLTF("/models/cat/concrete_cat_statue_4k.gltf");

  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.y += 0.01;
    }
  });

  return <primitive ref={ref} object={scene} />;
}

export default function ModelDisplay() {
  return (
    <div className="w-full h-200 bg-gray-900">
      <Canvas camera={{ position: [0, 0.5, 1], fov: 40 }}>
        {/* lights */}
        <ambientLight intensity={0.8} />
        <directionalLight position={[5, 5, 7.5]} intensity={0.5} />

        {/* environment reflection (optional) */}
        <Environment preset="studio" />

        {/* orbit controls */}
        <OrbitControls enableDamping dampingFactor={0.05} />

        {/* your model */}
        <BowlModel />
      </Canvas>
    </div>
  );
}
