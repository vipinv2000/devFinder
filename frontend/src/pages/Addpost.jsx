import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { toast } from "react-hot-toast";
import axios from "axios";
import { FaLock, FaGlobe } from "react-icons/fa";

const AddPost = () => {
  const { authUser } = useAuthStore();
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState(null);
  const [description, setDescription] = useState("");
  const [visibility, setVisibility] = useState("public"); // Default: Public

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!caption.trim() || !image) {
      return toast.error("Caption and Image are required!");
    }

    const formData = new FormData();
    formData.append("caption", caption);
    formData.append("image", image);
    formData.append("description", description);
    formData.append("visibility", visibility === "private"); // Boolean value for backend

    try {
      await axios.post("/api/posts", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Post added successfully!");
      setCaption("");
      setImage(null);
      setDescription("");
      setVisibility("public");
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col items-center justify-center p-6">
      <div className="bg-gray-800 p-6 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold text-white text-center mb-6">
          Add New Post
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Caption */}
          <textarea
            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-white"
            rows="3"
            placeholder="Write a caption..."
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
          />

          {/* Description */}
          <textarea
            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-white"
            rows="2"
            placeholder="Write a description (optional)..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          {/* Image Upload */}
          <input
            type="file"
            accept="image/*"
            className="w-full p-2 border border-gray-600 rounded-lg bg-gray-700 text-white cursor-pointer"
            onChange={(e) => setImage(e.target.files[0])}
          />

          {/* Visibility Toggle */}
          <div className="flex items-center justify-between bg-gray-700 p-3 rounded-lg border border-gray-600">
            <span className="text-white">Visibility:</span>
            <button
              type="button"
              className="flex items-center gap-2 text-white p-2 rounded-lg transition bg-blue-600 hover:bg-blue-700"
              onClick={() => setVisibility(visibility === "public" ? "private" : "public")}
            >
              {visibility === "public" ? <FaGlobe /> : <FaLock />}
              {visibility === "public" ? "Public" : "Private"}
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-purple-500 text-white p-3 rounded-lg hover:bg-purple-600 transition"
          >
            Post
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddPost;
