"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function ClayEffect() {
  const containerRef = useRef(null);

  useEffect(() => {
    // --- BASIC SETUP ---
    const container = containerRef.current;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    // --- LIGHT ---
    const light = new THREE.DirectionalLight(0xd2b48c, 2);
    light.position.set(1, 1, 1);
    scene.add(light);
    const ambient = new THREE.AmbientLight(0xffffff, 2);
    scene.add(ambient);

    // --- GEO + MATERIAL ---
    const geometry = new THREE.IcosahedronGeometry(1, 10);
    const material = new THREE.MeshStandardMaterial({
      color: 0xd2b48c,
      roughness: 0.4,
      metalness: 0.5,
    });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // --- CAMERA POS ---
    camera.position.z = 3;

    // --- DEFORM ANIMATION LOGIC ---
    const positionAttr = geometry.attributes.position;
    const originalPositions = positionAttr.array.slice(); // copy original vertices

    const clock = new THREE.Clock();

    function animate() {
      const time = clock.getElapsedTime();
      for (let i = 0; i < positionAttr.count; i++) {
        const ix = i * 3;
        const iy = ix + 1;
        const iz = ix + 2;

        const ox = originalPositions[ix];
        const oy = originalPositions[iy];
        const oz = originalPositions[iz];

        const offset = 0.2 * Math.sin(time * 2 + ox * 3 + oy * 4 + oz * 5); // wobbly effect

        positionAttr.array[ix] = ox + ox * offset * 0.3;
        positionAttr.array[iy] = oy + oy * offset * 0.3;
        positionAttr.array[iz] = oz + oz * offset * 0.3;
      }
      positionAttr.needsUpdate = true;

      mesh.rotation.x += 0.003;
      mesh.rotation.y += 0.004;

      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    }

    animate();

    // --- HANDLE RESIZE ---
    function handleResize() {
      const { clientWidth, clientHeight } = container;
      renderer.setSize(clientWidth, clientHeight);
      camera.aspect = clientWidth / clientHeight;
      camera.updateProjectionMatrix();
    }
    window.addEventListener("resize", handleResize);

    // --- CLEANUP ---
    return () => {
      window.removeEventListener("resize", handleResize);
      container.removeChild(renderer.domElement);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{ width: "100%", height: "100px", position: "relative" }}
    />
  );
}
