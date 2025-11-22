"use client";

import React, { useEffect, useState } from "react";

export default function FileList() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFiles() {
      try {
        const res = await fetch("/api/models"); // calls your API route
        if (!res.ok) throw new Error("Failed to fetch models");
        const data = await res.json();
        setFiles(data);
      } catch (err) {
        console.error("Error loading files:", err);
      } finally {
        setLoading(false);
      }
    }

    loadFiles();
  }, []);

  if (loading) return <p>Loading models...</p>;

  if (!files.length) return <p>No models found in the bucket.</p>;

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Available 3D Models</h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {files.map((file, index) => (
          <li
            key={`${file.name}-${index}`} // 👈 unique stable key
            style={{
              border: "1px solid #ccc",
              borderRadius: "6px",
              padding: "10px",
              marginBottom: "10px",
            }}
          >
            <strong>{file.name}</strong>
            <div style={{ marginTop: "0.5rem" }}>
              <a
                href={file.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-block",
                  textDecoration: "none",
                  background: "#0070f3",
                  color: "#fff",
                  padding: "6px 12px",
                  borderRadius: "4px",
                }}
              >
                Download
              </a>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
