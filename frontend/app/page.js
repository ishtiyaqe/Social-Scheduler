"use client"; 

import { useState } from "react";
import axios from "axios";
import ImageUploader from "./components/ImageUploader";

export default function Home() {
  const [text, setText] = useState("");
  const [platforms, setPlatforms] = useState({ facebook: true, twitter: false, instagram: false });
  const [file, setFile] = useState(null);
  const [scheduledTime, setScheduledTime] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    const pl = Object.keys(platforms).filter(k => platforms[k]);
    if (!scheduledTime) {
      alert("Pick scheduled time (ISO). Use local date/time picker.");
      return;
    }
    const form = new FormData();
    form.append("text", text);
    form.append("platforms", pl.join(","));
    form.append("scheduled_time", scheduledTime);
    if (file) form.append("image", file);

    try {
      const res = await axios.post("http://localhost:8000/posts/", form, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      alert("Scheduled! id=" + res.data.id);
      setText(""); setFile(null);
    } catch (err) {
      console.error(err);
      alert("Error: " + (err.response?.data?.detail || err.message));
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Create Scheduled Post</h1>
      <form onSubmit={submit} className="space-y-4">
        <textarea
          value={text}
          onChange={(e)=>setText(e.target.value)}
          required
          className="w-full p-2 border rounded"
          placeholder="Post text"
        />

        <div>
          <label className="mr-2">
            <input
              type="checkbox"
              checked={platforms.facebook}
              onChange={(e)=>setPlatforms({...platforms, facebook:e.target.checked})}
            /> Facebook
          </label>
          <label className="ml-4 mr-2">
            <input
              type="checkbox"
              checked={platforms.twitter}
              onChange={(e)=>setPlatforms({...platforms, twitter:e.target.checked})}
            /> Twitter
          </label>
          <label className="ml-4 mr-2">
            <input
              type="checkbox"
              checked={platforms.instagram}
              onChange={(e)=>setPlatforms({...platforms, instagram:e.target.checked})}
            /> Instagram
          </label>
        </div>

        <div>
          <label className="block mb-1">Image</label>
          <ImageUploader onFile={setFile} />
          {file && <div className="mt-2 text-sm">{file.name}</div>}
        </div>

        <div>
          <label className="block mb-1">Schedule time:</label>
          <input
            type="datetime-local"
            value={scheduledTime}
            onChange={(e)=>setScheduledTime(e.target.value)}
            className="border p-2 rounded w-full"
          />
          <p className="text-sm text-gray-500 mt-1">
            Make sure server & client timezones align; backend expects ISO string.
          </p>
        </div>

        <div>
          <button className="px-4 py-2 bg-blue-600 text-white rounded">Schedule Post</button>
        </div>
      </form>
    </div>
  );
}
