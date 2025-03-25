import React, { useState } from 'react';
import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';
import { axiosInstance } from '../lib/axios';
import { FaHeart } from 'react-icons/fa';

const Feedpost = ({ singlePost, post }) => {
  const { authUser } = useAuthStore();
  const userId = authUser?._id;

  const [likes, setLikes] = useState(singlePost.like || []);

  const handleLike = async postId => {
    try {
      const response = await axiosInstance.put(
        `/userdash/likeFunction/${postId}`
      );
      console.log(response);
      

      if (response.data.success==true) {
        setLikes(
          prevLikes =>
            prevLikes.includes(userId)
              ? prevLikes.filter(id => id !== userId) 
              : [...prevLikes, userId] 
        );
      }
    } catch (error) {
      console.error('Error liking/unliking post:', error);
    }
  };

  return (
    <div
      className={`mb-6 p-5 rounded-lg shadow-md border ${
        singlePost.isPrivate ? 'border-green-500' : 'border-gray-700'
      } bg-gray-800`}
    >
      {/* User Info */}
      <div className="flex items-center gap-3">
        <img
          src={post.user?.profilePic || '/avatar.png'}
          alt="avatar.png"
          className="w-12 h-12 rounded-full border border-gray-600"
        />
        <div>
          <h3 className="font-semibold text-lg">
            {post.user?.fullName || 'Unknown User'}
          </h3>
          <p className="text-xs text-gray-400">
            {new Date(singlePost.date).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Private Post Indicator */}
      {singlePost.isPrivate && (
       <div className='flex justify-end w-full -mt-11' >
         <div className="flex items-center text-green-400 mt-2 ">
          🔒 <span className="ml-1 text-sm">Private Post</span>
        </div>
       </div>
      )}

      {/* Post Image */}
      {singlePost.image && (
        <img
          src={singlePost.image}
          alt="post"
          className="w-full h-auto max-h-[500px] rounded-lg object-contain"
        />
      )}

      {/* Caption & Description */}
      <p className="text-xl font-extrabold mt-3 text-blue-400">
        {singlePost.caption}
      </p>
      <p className="text-sm text-gray-300 mt-1">{singlePost.description}</p>

      {/* Like Button */}
      <button
        onClick={() => handleLike(singlePost._id)}
        className="flex items-center gap-2 mt-3"
      >
        <FaHeart
          className={`text-2xl transition-colors ${
            likes.includes(userId) ? 'text-red-500' : 'text-gray-400'
          } hover:text-red-500`}
        />
        <span className="text-white">{likes.length}</span>
      </button>
    </div>
  );
};

export default Feedpost;
