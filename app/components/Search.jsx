"use client"; // (only needed if you’re in the Next.js App Router)

import { useState } from "react";

export default function Search() {
  const [term, setTerm] = useState("");

  function handleSearch() {
    if (typeof window !== "undefined" && window.dataLayer) {
      window.dataLayer.push({
        event: "search",
        search_term: term,
      });
      console.log("Pushed to dataLayer:", term);
    } else {
      console.warn("dataLayer not found");
    }
  }

  return (
    <div className="flex flex-col gap-2 w-full max-w-xs">
      <label>Search your name:</label>
      <input
        className="border border-gray rounded-sm p-1"
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        placeholder="Type something..."
      />
      <button
        onClick={handleSearch}
        className="bg-blue-500 text-white rounded-sm py-1 hover:bg-blue-600"
      >
        Search
      </button>
    </div>
  );
}
