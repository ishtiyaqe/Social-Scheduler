import { useRef } from "react";

export default function ImageUploader({ onFile }) {
  const ref = useRef();
  return (
    <div>
      <input
        ref={ref}
        type="file"
        accept="image/*"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) onFile(e.target.files[0]);
        }}
        className="block"
      />
    </div>
  );
}
