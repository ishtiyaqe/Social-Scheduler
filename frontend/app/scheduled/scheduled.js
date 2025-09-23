import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";

export default function Scheduled() {
  const [posts, setPosts] = useState([]);
  const fetchPosts = async () => {
    try {
      const res = await axios.get("http://localhost:8000/posts/");
      setPosts(res.data);
    } catch (e) { console.error(e) }
  };
  useEffect(()=>{ fetchPosts(); }, []);
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Scheduled Posts</h1>
      <button onClick={fetchPosts} className="mb-4 px-3 py-1 bg-gray-200 rounded">Refresh</button>
      <div className="space-y-4">
        {posts.map(p => (
          <div key={p.id} className="p-4 border rounded flex gap-4">
            <div className="flex-1">
              <div className="font-semibold">{p.text.slice(0,200)}</div>
              <div className="text-sm">Platforms: {p.platforms.join(", ")}</div>
              <div className="text-sm">Scheduled: {new Date(p.scheduled_time).toLocaleString()}</div>
              {p.image_path && (
                <Image
                  src={"http://localhost:8000" + p.image_path}
                  alt="img"
                  width={128}
                  height={128}
                  className="w-32 mt-2"
                  unoptimized
                />
              )}
              {p.image_path && (
                <Image
                  src={"http://localhost:8000" + p.image_path}
                  alt="img"
                  width={128}
                  height={128}
                  className="w-32 mt-2"
                  unoptimized
                />
              )}
              {p.result && <div className="mt-2 text-xs text-gray-600">{p.result}</div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
