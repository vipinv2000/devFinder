import { useState } from "react";
import { toast } from "react-hot-toast";
import axios from "axios";

const AddStory = () => {
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!caption.trim() || !image) {
      return toast.error("Caption and Image are required!");
    }

    const formData = new FormData();
    formData.append("caption", caption);
    formData.append("image", image);

    try {
      await axios.post("/api/stories", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Story added successfully!");
      setCaption("");
      setImage(null);
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col items-center justify-center p-6">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">
          Add Story
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
            placeholder="Story Caption"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
          />
          <input
            type="file"
            accept="image/*"
            className="w-full p-2 border rounded-lg"
            onChange={(e) => setImage(e.target.files[0])}
          />
          <button
            type="submit"
            className="w-full bg-purple-500 text-white p-3 rounded-lg hover:bg-purple-600 transition"
          >
            Upload Story
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddStory;
