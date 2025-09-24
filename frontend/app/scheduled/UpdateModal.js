'use client';
import { useState, useEffect } from "react";

export default function UpdateModal({ isOpen, onClose, onSubmit, post }) {
  const [formData, setFormData] = useState({
    text: "",
    image: null,
    scheduledTime: "",
  });

  useEffect(() => {
    if (post) {
      setFormData({
        text: post.text || "",
        image: null,
        scheduledTime: post.scheduled_time
          ? new Date(post.scheduled_time).toISOString().slice(0,16)
          : "",
      });
    }
  }, [post]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFormData(prev => ({ ...prev, image: files[0] }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.text  === "") {
      alert("Text is required");
      return;
    }
    onSubmit(formData); // send to parent
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Update Post</h2>
        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label className="block text-sm font-medium">Text</label>
            <textarea
              name="text"
              value={formData.text}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              rows="3"
            />
          </div>

         

          <div>
            <label className="block text-sm font-medium">Scheduled Time</label>
            <input
              type="datetime-local"
              name="scheduledTime"
              value={formData.scheduledTime}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Image</label>
            <input type="file" name="image" onChange={handleChange} accept="image/*" />
          </div>

          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Save</button>
          </div>

        </form>
      </div>
    </div>
  );
}
