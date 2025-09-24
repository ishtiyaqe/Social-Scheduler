'use client';

import { useRef, useState } from "react";
import Image from "next/image";

export default function ImageUploader({ onFile }) {
  const ref = useRef();
  const [dragging, setDragging] = useState(false);
  const [preview, setPreview] = useState(null);

  const handleFiles = (file) => {
    if (file) {
      onFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  return (
    <div>
      {/* Hidden file input */}
      <input
        ref={ref}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) handleFiles(e.target.files[0]);
        }}
      />

      {/* Drag & Drop Box */}
      <div
        onClick={() => ref.current.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFiles(e.dataTransfer.files[0]);
          }
        }}
        className={`w-full max-w-md mx-auto p-6 border-2 border-dashed rounded-lg cursor-pointer transition 
          ${dragging ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-white"}
        `}
      >
        {preview ? (
          <Image
            src={preview}
            alt="Preview"
            width={400}
            height={192}
            className="w-full h-48 object-cover rounded-lg"
            style={{ objectFit: "cover", borderRadius: "0.5rem" }}
            unoptimized
          />
        ) : (
          <div className="text-center text-gray-500">
            <p className="mb-2">Drag & drop an image here</p>
            <p className="text-sm">or click to select a file</p>
          </div>
        )}
      </div>
    </div>
  );
}
