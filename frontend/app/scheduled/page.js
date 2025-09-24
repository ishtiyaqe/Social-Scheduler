"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import UpdateModal from "./UpdateModal"; // 👈 import modal
import Image from "next/image";

export default function Scheduled() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:8000/posts/");
      setPosts(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const openModal = (post) => {
    setEditingPost(post);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setEditingPost(null);
    setIsModalOpen(false);
  };

  const handleUpdate = async (formData) => {
    if (!editingPost) return;

    try {
      const data = new FormData();
      data.append("text", formData.text);
      data.append("price", formData.price);
      data.append("platforms", editingPost.platforms.join(","));
      data.append("scheduled_time", editingPost.scheduled_time);
      if (formData.image) {
        data.append("image", formData.image);
      }

      await axios.put(`http://localhost:8000/posts/${editingPost.id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      fetchPosts();
      closeModal();
    } catch (err) {
      console.error(err);
      alert("Failed to update post");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold">Scheduled Posts</h1>
        <button
          onClick={fetchPosts}
          disabled={loading}
          className={`mb-4 px-3 py-1 rounded ${
            loading
              ? "bg-gray-400 dark:bg-gray-900 cursor-not-allowed"
              : "bg-gray-200 dark:bg-gray-900 hover:bg-gray-300"
          }`}
        >
          {loading ? "Loading..." : "Refresh"}
        </button>
      </div>

      <div className="space-y-4">
        {posts.map((p) => (
          <div
            key={p.id}
            className="p-4 border rounded flex gap-4 justify-between items-start"
          >
            <div className="flex-1">
              <div className="font-semibold">{p.text.slice(0, 200)}</div>
              <div className="text-sm">Platforms: {p.platforms.join(", ")}</div>
              {p.price && <div className="text-sm">Price: {p.price}</div>}
              <div className="text-sm">
                Scheduled: {new Date(p.scheduled_time).toLocaleString()}
              </div>
              <div className="text-sm">
                Status:{" "}
                <span
                  className={
                    p.status === "published" ? "text-green-600" : "text-orange-600"
                  }
                >
                  {p.status}
                </span>
              </div>
              {p.image_path && (
                <Image
                  src={"http://localhost:8000" + p.image_path}
                  alt="img"
                  className="w-32 mt-2 rounded"
                  width={128}
                  height={128}
                />
              )}
              {p.result && (
                <div className="mt-2 text-xs text-gray-600">{p.result}</div>
              )}
            </div>

            {(p.status === "pending" || p.status === "scheduled") && (
              <button
                onClick={() => openModal(p)}
                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Update
              </button>
            )}
          </div>
        ))}
      </div>

      {/* ✅ Use the modal component */}
      <UpdateModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={handleUpdate}
        post={editingPost}
      />
    </div>
  );
}
