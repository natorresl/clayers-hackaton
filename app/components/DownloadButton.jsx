"use client";

import React, { useState } from "react";

export default function DownloadButton() {
  const [loading, setLoading] = useState(false);

  // <-- Use your signed URL here
  const signedUrl =
    "https://hackathon-clayers.storage.googleapis.com/danfo.fbx?x-goog-signature=5f063f1bc04249914b59b2dfa1ab3abcadd4ebd43ef6ded71df0fb4f3f67925a1a1b227fb99ca5d317c2e7323b77166d488021f945029ab9db242b4a0f365f4220d84a7244832c8808b4d76e4339fb7cec9b09f2efd1b1307b63b2c689437268a120384f5d4243ea802502716192deaa0d141f58af6bada1e173cb50fbcef5e3a4c29acd31554752f28f110e03949b7b0da3a9c1a26daa5a4c5f8c285a9c77cb74c70189915d73fae34fe05c61c7e4d2e3dd30821f65a6c9e391a4ee581c72667a6ca868af61f1d6d0344e50eaedee7ddee1017abad8337bf015edf37e23fe8142382eed51dba3f511a1cb90ffe459b4a79092196b829e30a7b75b3bd259f50f&x-goog-algorithm=GOOG4-RSA-SHA256&x-goog-credential=clayers%40quiet-bruin-478917-q2.iam.gserviceaccount.com%2F20251122%2Feu%2Fstorage%2Fgoog4_request&x-goog-date=20251122T102101Z&x-goog-expires=43200&x-goog-signedheaders=host";

  const handleDownload = async () => {
    try {
      setLoading(true);

      // Fetch the file as a Blob
      const response = await fetch(signedUrl);
      if (!response.ok) throw new Error("Network response was not ok");

      const blob = await response.blob();

      // Create a blob URL and trigger browser download
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "danfo.fbx.obj"; // Your desired file name
      a.style.display = "none";

      document.body.appendChild(a);
      a.click();

      // Cleanup
      window.URL.revokeObjectURL(url);
      a.remove();
    } catch (error) {
      console.error("Download failed:", error);
      alert("Download failed! Check the console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={loading}
      style={{
        padding: "10px 20px",
        fontSize: "16px",
        backgroundColor: loading ? "#aaa" : "#0070f3",
        border: "none",
        color: "#fff",
        borderRadius: "4px",
        cursor: "pointer",
      }}
    >
      {loading ? "Downloading..." : "Download model"}
    </button>
  );
}
