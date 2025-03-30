import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { assets } from '../../../frontend/src/assets/assets.js';
import { useAuthStore } from '../store/useAuthStore.js';

const Feedpost = ({ singlePost, post, isprofile = false, toggleRefresh }) => {
  console.log("post",post);
  
  const { Do_User_Post_Like } = useAuthStore();

  // Initialize local state based on the post's current like status
  const [liked, setLiked] = useState(singlePost?.isLiked || false);
  const [likesCount, setLikesCount] = useState(singlePost?.like?.length || 0);

  // Handle Like Click
  const handleLikeToggle = (postId, collectionId) => {
    
    const audio = new Audio(assets.popsound);
    !liked && audio.play();

    // Optimistic UI update
    setLiked((prevLiked) => !prevLiked);
    setLikesCount((prevCount) => (liked ? prevCount - 1 : prevCount + 1));

    // Call API to update backend
    Do_User_Post_Like(postId, collectionId);

    // Trigger refresh if needed
    toggleRefresh.setRefresh((prev) => !prev);

  };

  return (
    <div

      className={`${isprofile ? "w-[50%]" : "w-full"} mb-6 p-5 rounded-lg shadow-md border ${singlePost.isPrivate ? "border-green-500" : "border-gray-700"
        } bg-gray-800 relative flex flex-col justify-between`}
    >
      {/* Post Content */}
      <div>
        {!isprofile && post?.user && (
          <div className="flex items-center gap-3">
            <img
              src={post?.user?.profilePic || "/avatar.png"}
              alt="user"
              className="w-12 h-12 rounded-full border border-gray-600"
            />
            <div>
              <h3 className="font-semibold text-lg">{post?.user?.fullName || "Unknown User"}</h3>
              <p className="text-xs text-gray-400">{new Date(singlePost.date).toLocaleString()}</p>
            </div>
          </div>
        )}

        {isprofile && (
          <p className="text-xl font-extrabold mt-3 text-blue-400 mb-3">{singlePost.caption}</p>
        )}

        {/* Private Post Indicator */}
        {singlePost.isPrivate && (
         <div className='flex justify-end -mt-11' >
           <div className="flex items-center text-green-400 mt-2">
            🔒 <span className="ml-1 text-sm">Private Post</span>
          </div>
         </div>
        )}

        {/* Post Image */}
       { singlePost.image !='' ?
        <img
          src={singlePost.image}
          alt="post"
          className="w-full h-auto max-h-[500px] rounded-lg object-contain mt-3"
        />:''}


        {!isprofile && <p className="text-xl font-extrabold mt-3 text-blue-400">{singlePost.caption}</p>}

        <p className="text-sm text-gray-300 mt-3">{singlePost.description}</p>
      </div>

      {/* Like Button */}
      <div className="mt-4 flex items-center gap-2 text-white cursor-pointer">
        {
          isprofile  ? (
        <motion.div
          className="flex items-center"
          onClick={() => handleLikeToggle(singlePost._id,singlePost.postCollectionId)}
          initial={{ scale: 1 }}
          whileTap={{ scale: 0.9 }} // Shrinks when clicked
          whileHover={{ scale: 1.1 }} // Slight enlargement on hover
          transition={{ type: 'spring', stiffness: 300, damping: 10 }}
        >
          <Heart
            className="h-6 w-6 opacity-65"
            fill={liked ? 'red' : 'none'} // Uses local state now
            stroke={liked ? 'red' : 'white'}
          />
        </motion.div>
        ):(
        <motion.div
          className="flex items-center"
          onClick={() => handleLikeToggle(singlePost._id, post._id)}
          initial={{ scale: 1 }}
          whileTap={{ scale: 0.9 }} // Shrinks when clicked
          whileHover={{ scale: 1.1 }} // Slight enlargement on hover
          transition={{ type: 'spring', stiffness: 300, damping: 10 }}
        >
          <Heart
            className="h-6 w-6 opacity-65"
            fill={liked ? 'red' : 'none'} // Uses local state now
            stroke={liked ? 'red' : 'white'}
          />
        </motion.div>
        )
        }

        <p>{likesCount} Likes</p>
      </div>

    </div>
  );
};

export default Feedpost;
