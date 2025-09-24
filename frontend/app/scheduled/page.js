"use client";
import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import UpdateModal from "./UpdateModal"; 
import Image from "next/image";

export default function Scheduled() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);

  const [selectedPlatform, setSelectedPlatform] = useState(""); // filter
  const [currentPage, setCurrentPage] = useState(1); // pagination
  const postsPerPage = 10;

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

  useEffect(() => { fetchPosts(); }, []);

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
      data.append("price", formData.price ?? 0);
      data.append("platforms", editingPost.platforms.join(","));
      data.append("scheduled_time", editingPost.scheduled_time);
      if (formData.image) data.append("image", formData.image);

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

  // Unique platforms for filter dropdown
  const platformOptions = useMemo(() => {
    const set = new Set();
    posts.forEach(p => p.platforms.forEach(pl => set.add(pl)));
    return Array.from(set);
  }, [posts]);

  // Filter posts by platform
  const filteredPosts = useMemo(() => {
    if (!selectedPlatform) return posts;
    return posts.filter(p => p.platforms.includes(selectedPlatform));
  }, [posts, selectedPlatform]);

  // Pagination: calculate current page posts
  const paginatedPosts = useMemo(() => {
    const start = (currentPage - 1) * postsPerPage;
    return filteredPosts.slice(start, start + postsPerPage);
  }, [filteredPosts, currentPage]);

  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Scheduled Posts</h1>
        <button
          onClick={fetchPosts}
          disabled={loading}
          className={`px-3 py-1 rounded ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-gray-200 hover:bg-gray-300"}`}
        >
          {loading ? "Loading..." : "Refresh"}
        </button>
      </div>

      {/* Platform filter dropdown */}
      <div className="mb-4">
        <label className="mr-2 font-medium">Filter by Platform:</label>
        <select
          value={selectedPlatform}
          onChange={(e) => {
            setSelectedPlatform(e.target.value);
            setCurrentPage(1); // reset page when filter changes
          }}
          className="border p-1 rounded"
        >
          <option value="">All</option>
          {platformOptions.map((pl) => (
            <option key={pl} value={pl}>{pl}</option>
          ))}
        </select>
      </div>

      <div className="space-y-4">
        {paginatedPosts.map((p) => (
          <div
            key={p.id}
            className="p-4 border rounded flex gap-4 justify-between items-start"
          >
            <div className="flex-1">
              <div className="font-semibold">{p.text.slice(0, 200)}</div>
              <div className="text-sm">Platforms: {p.platforms.join(", ")}</div>
              {p.price && <div className="text-sm">Price: {p.price}</div>}
              <div className="text-sm">Scheduled: {new Date(p.scheduled_time).toLocaleString()}</div>
              <div className="text-sm">
                Status: <span className={p.status === "published" ? "text-green-600" : "text-orange-600"}>{p.status}</span>
              </div>
              {p.image_path && (
                <Image
                  src={"http://localhost:8000" + p.image_path}
                  alt="img"
                  width={128}
                  height={128}
                  className="w-32 mt-2 rounded"
                />
              )}
              {p.result && <div className="mt-2 text-xs text-gray-600">{p.result}</div>}
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

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-4 gap-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded hover:bg-gray-200"
          >
            Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 border rounded ${currentPage === i + 1 ? "bg-blue-500 text-white" : "hover:bg-gray-200"}`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded hover:bg-gray-200"
          >
            Next
          </button>
        </div>
      )}

      <UpdateModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={handleUpdate}
        post={editingPost}
      />
    </div>
  );
}
