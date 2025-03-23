import React from 'react'

const Feedpost = ({singlePost,post}) => {
  return (
    <div
         
          className={`mb-6 p-5 rounded-lg shadow-md border ${
            singlePost.isPrivate ? "border-green-500" : "border-gray-700"
          } bg-gray-800`}
        >
          {/* User Info */}
          <div className="flex items-center gap-3">
            <img
              src={post.user?.profilePic || "https://via.placeholder.com/40"}
              alt="user"
              className="w-12 h-12 rounded-full border border-gray-600"
            />
            <div>
              <h3 className="font-semibold text-lg">{post.user?.fullName || "Unknown User"}</h3>
              <p className="text-xs text-gray-400">{new Date(singlePost.date).toLocaleString()}</p>
            </div>
          </div>
    
          {/* Private Post Indicator */}
          {singlePost.isPrivate && (
            <div className="flex items-center text-green-400 mt-2">
              🔒 <span className="ml-1 text-sm">Private Post</span>
            </div>
          )}
    
          <img
            src={singlePost.image}
            alt="post"
            className="w-full h-auto max-h-[500px] rounded-lg object-contain"
          />
    
          <p className="text-xl font-extrabold mt-3 text-blue-400">{singlePost.caption}</p>
          <p className="text-sm text-gray-300 mt-1">{singlePost.description}</p>
    
          <button
            onClick={() => handleLike(singlePost._id)}
            className="flex items-center gap-2 mt-3 text-red-400 hover:text-red-500"
          >
            ❤️ {singlePost.likes || 0} Likes
          </button>
        </div>
  )
}

export default Feedpost