"use client";

import React, { useEffect, useState, useRef } from "react";
import * as THREE from "three";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export default function ModelGallery() {
  const [models, setModels] = useState([]);

  useEffect(() => {
    fetch("/api/list-files")
      .then((res) => res.json())
      .then(setModels)
      .catch((err) => console.error("Failed to load models:", err));
  }, []);

  if (!models.length) return <p style={{ color: "white" }}>Loading models…</p>;

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "2rem",
        justifyContent: "center",
        background: "#000",
        padding: "2rem",
      }}
    >
      {models.map(({ name, url }) => (
        <div
          key={name}
          style={{
            marginBottom: "2rem",
            textAlign: "center",
            border: "1px solid #333",
            padding: "1rem",
            background: "#111",
            width: "450px",
          }}
        >
          <h3 style={{ color: "white" }}>{name}</h3>
          <ModelViewer url={url} />
          <DownloadButton url={url} fileName={name} />
        </div>
      ))}
    </div>
  );
}

function ModelViewer({ url }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x111111);

    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
    camera.position.set(2, 1, 4);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      canvas: canvasRef.current,
    });
    renderer.setSize(400, 400);
    renderer.setPixelRatio(window.devicePixelRatio);

    // Lights
    const ambient = new THREE.AmbientLight(0xffffff, 0.7);
    const directional = new THREE.DirectionalLight(0xffffff, 0.8);
    directional.position.set(5, 5, 5);
    scene.add(ambient, directional);

    // Orbit Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = true;
    controls.zoomSpeed = 1.0;
    controls.minDistance = 1;
    controls.maxDistance = 10;
    controls.rotateSpeed = 0.8;
    controls.target.set(0, 0, 0);

    // Model loading
    const cleanUrl = url.split("?")[0];
    const ext = cleanUrl.split(".").pop().toLowerCase();

    let loader = null;
    if (ext === "obj") loader = new OBJLoader();
    else if (ext === "fbx") loader = new FBXLoader();

    let model = null;
    let animationFrameId;

    if (!loader) {
      console.warn("No loader for model:", ext);
      return () => renderer.dispose();
    }

    loader.load(
      url,
      (object) => {
        model = object;

        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        model.position.sub(center);

        scene.add(model);

        const animate = () => {
          animationFrameId = requestAnimationFrame(animate);
          if (model) model.rotation.y += 0.01;
          controls.update();
          renderer.render(scene, camera);
        };

        animate();
      },
      undefined,
      (err) => console.error("Error loading model:", err)
    );

    return () => {
      cancelAnimationFrame(animationFrameId);
      controls.dispose();
      renderer.dispose();
      scene.clear();
    };
  }, [url]);

  return <canvas ref={canvasRef} style={{ width: 400, height: 400 }} />;
}

// ✅ Reusable Download Button
function DownloadButton({ url, fileName }) {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    try {
      setLoading(true);

      const response = await fetch(url);
      if (!response.ok) throw new Error("Network error");

      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = fileName || "model";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error("Download failed:", err);
      alert("Download failed! Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={loading}
      style={{
        marginTop: "1rem",
        padding: "10px 20px",
        fontSize: "14px",
        backgroundColor: loading ? "#73bedbff" : "#a7dbefff",
        border: "none",
        color: "#222222ff",
        cursor: "pointer",
      }}
    >
      {loading ? "Downloading..." : "Download Model"}
    </button>
  );
}
