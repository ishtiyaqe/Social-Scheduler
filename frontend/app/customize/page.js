"use client";
import { use, useState } from "react";
import ProductPreview from "../components/ProductPreview";
import axios from "axios";

export default function Customize() {
  const [text, setText] = useState("");
  const save = async () => {
    try {
      await axios.post("http://localhost:8000/customizations/", new URLSearchParams({ product: "tshirt", text }));
      alert("Saved customization!");
    } catch (e) {
      console.error(e);
      alert("Error saving");
    }
  };
  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Product Customization</h1>
      <div className="flex gap-6">
        <ProductPreview text={text || "Your Text"} />
        <div className="flex-1">
          <input value={text} onChange={e=>setText(e.target.value)} placeholder="Type text to overlay" className="w-full border p-2 rounded" />
          <button onClick={save} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded">Save Design</button>
        </div>
      </div>
    </div>
  );
}
