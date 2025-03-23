import { useState } from "react";
import { toast } from "react-hot-toast";
import axios from "axios";
import { axiosInstance } from "../lib/axios";
import { useNavigate } from "react-router-dom";

const AddStory = () => {
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState(null);
  const [formData, setFormData] = useState({
    caption:'',
    image:''
  });
  const navigate=useNavigate()

  const handleImageChange = e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const base64Image = reader.result;
      setImage(base64Image);
    };
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    
  
    try {
      const finalData = { 
        caption: formData.caption, 
        image: image, 
      
      };
      console.log("finaldata",finalData);
      await axiosInstance.post("/userdash/addStory", finalData);
      toast.success("Story added successfully!");
      setCaption("");
      setImage('null');
      navigate('/')
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
            className="w-full p-3 text-black border rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
            placeholder="Story Caption"
            value={formData.caption}
            onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
          />
          <input
            type="file"
            accept="image/*"
            className="w-full p-2 border border-gray-600 rounded-lg bg-gray-200 text-black cursor-pointer"
            onChange={handleImageChange}
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
