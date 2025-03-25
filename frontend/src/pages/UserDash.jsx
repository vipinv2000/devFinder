import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaCommentDots, FaUser, FaUsers, FaPlusCircle, FaHome, FaArrowLeft, FaArrowRight, FaTimes } from "react-icons/fa";
import { MdAddBox } from "react-icons/md";
import { axiosInstance } from "../lib/axios";
import Feedpost from "../components/Feedpost";

const UserDashboard = () => {
  const [stories, setStories] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [showFooter, setShowFooter] = useState(false);
  const [selectedStories, setSelectedStories] = useState([]);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [showStoryViewer, setShowStoryViewer] = useState(false);

  useEffect(() => {
    fetchStories();
    fetchPosts();
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [page]);

  const fetchStories = async () => {
    try {
      const response = await axiosInstance.get("/userdash/getStory");

      if (Array.isArray(response.data.story)) {
        const formattedStories = response.data.story.flatMap(item =>
          (item.story || []).map(story => ({
            ...story,
            userName: item.user.fullName,
            userProfilePic: item.user.profilePic,
          }))
        );
        setStories(formattedStories.reverse());
      } else {
        setStories([]);
      }
    } catch (error) {
      console.error("Error fetching stories:", error);
    }
  };

  const fetchPosts = async () => {
    if (!hasMore || loading) return;
  
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/userdash/getFeedPosts?page=${page}`);
      const newPosts = response.data.posts;
  
      if (newPosts.length === 0) {
        setHasMore(false);
      } else {
        setPosts(prev => {
          // Prevent duplicates by checking if post already exists
          const uniquePosts = newPosts.filter(
            (newPost) => !prev.some((prevPost) => prevPost._id === newPost._id)
          );
          return [...prev, ...uniquePosts];
        });
      }
  
      setLoading(false);
    } catch (error) {
      setError(true);
      setLoading(false);
    }
  };
  

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop >=
      document.documentElement.offsetHeight - 50
    ) {
      setPage(prev => prev + 1);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleMouseMove = (event) => {
    setShowFooter(event.clientY > window.innerHeight - 60);
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const viewStory = (startIndex) => {
    setSelectedStories(stories);
    setCurrentStoryIndex(startIndex);
    setShowStoryViewer(true);
  };

  // Close Story Viewer
  const closeStoryViewer = () => {
    setShowStoryViewer(false);
  };

  // Auto-switch stories every 5 sec
  useEffect(() => {
    if (showStoryViewer && selectedStories.length > 0) {
      const timer = setTimeout(() => {
        if (currentStoryIndex < selectedStories.length - 1) {
          setCurrentStoryIndex(prev => prev + 1);
        } else {
          closeStoryViewer();
        }
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showStoryViewer, currentStoryIndex, selectedStories]);

  // Go to Next Story
  const nextStory = () => {
    if (currentStoryIndex < selectedStories.length - 1) {
      setCurrentStoryIndex(prev => prev + 1);
    } else {
      closeStoryViewer();
    }
  };

  // Go to Previous Story
  const prevStory = () => {
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex(prev => prev - 1);
    }
  };
  return (
    <div className="bg-gray-900 text-white min-h-screen p-2 relative">
      <h1 className="text-xl md:text-2xl font-extrabold font-serif italic text-white ml-4 mt-4 flex items-center gap-2 pb-2">
  <span className="text-blue-400">
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V6a2 2 0 012-2h12a2 2 0 012 2v2m-8 4v8m-4-4h8m-6-8h4m-6 4h8M4 16v2m16-2v2M4 12v2m16-2v2M4 8v2m16-2v2" />
    </svg>
  </span>
  <span className="bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
    TechHive
  </span>
</h1>

      {/* Story Viewer Modal */}
      {showStoryViewer && selectedStories.length > 0 && (
  <div className="fixed inset-0 bg-black bg-opacity-90 flex justify-center items-center z-50 p-6"  >
    {/* Close Button */}
    <button
      onClick={closeStoryViewer}
      className="absolute top-6 right-6 text-white text-3xl hover:text-gray-400 transition"
    >
      <FaTimes />
    </button>

    <div className="bg-gray-900 p-8 rounded-xl shadow-lg w-full max-w-4xl flex flex-col items-center">
      {/* User Info */}
      <div className="flex items-center gap-4 border-b border-gray-700 pb-4 w-full">
        <img
          src={selectedStories[currentStoryIndex].userProfilePic || "/avatar.png"}
          alt="User"
          className="w-16 h-16 rounded-full border-2 border-gray-600"
        />
        <div>
          <h3 className="font-semibold text-xl text-white">
            {selectedStories[currentStoryIndex].userName || "Unknown User"}
          </h3>
          <p className="text-sm text-gray-400">
            {new Date(selectedStories[currentStoryIndex].date).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Story Content */}
      <div className="mt-6 w-full flex justify-center">
        {selectedStories[currentStoryIndex].image ? (
          <img
            src={selectedStories[currentStoryIndex].image}
            alt="Story"
            className="w-full max-h-[600px] rounded-lg object-cover border border-gray-700"
          />
        ) : (
          <p className="text-2xl font-bold text-center text-blue-400 bg-gray-800 p-6 rounded-lg w-full">
            {selectedStories[currentStoryIndex].caption || "No Image Available"}
          </p>
        )}
      </div>

      {/* Caption (if image exists) */}
      {selectedStories[currentStoryIndex].image && (
        <p className="text-lg font-semibold mt-4 text-blue-400 text-center px-4">
          {selectedStories[currentStoryIndex].caption}
        </p>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between w-full mt-6">
        <button
          onClick={prevStory}
          className="text-white text-3xl p-3 hover:text-gray-400 transition"
        >
          <FaArrowLeft />
        </button>
        <button
          onClick={nextStory}
          className="text-white text-3xl p-3 hover:text-gray-400 transition"
        >
          <FaArrowRight />
        </button>
      </div>
    </div>
  </div>
)}


      {/* Stories Section */}
      <div className="relative flex items-center gap-8 overflow-x-auto p-4 border-b border-gray-500 bg-gray-600 shadow-md mb-6 rounded-xl">
        <Link to="/add-story" className="flex flex-col items-center ">
          <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center">
            <FaPlusCircle className="text-3xl text-blue-500" />
          </div>
          <p className="text-sm text-green-600 font-extrabold font-serif ">Add Story</p>
        </Link>
        {stories.length === 0 ? (
    <p className="text-gray-300 italic">No new stories</p>
  ) : (
    stories.map((story, index) => (
      <div key={index} className="flex flex-col items-center cursor-pointer" onClick={() => viewStory(index)}>
        <div className="relative w-20 h-20 rounded-full p-[2px] bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500">
          <img
            src={story.image || story.userProfilePic}
            alt="story"
            className="w-full h-full rounded-full border-2 border-gray-900 object-cover"
          />
        </div>
        <p className="text-sm font-semibold">{story.userName}</p>
      </div>
    ))
  )}
        
      </div>

      {/* Posts Section */}
     {error && <p className="text-center text-red-500">Failed to load posts. Please try again.</p>}

<div>
  {posts.length === 0 ? (
    <p className="text-center text-gray-300 italic mt-4">No posts available</p>
  ) : (
    posts.map((post) =>
      post.posts?.map((singlePost, index) => (
        <Feedpost singlePost={singlePost} post={post} key={index} />
      ))
    )
  )}
</div>


      <Link to="/chooseDeveloper" className="text-black text-2xl hover:text-blue-300">
      <div className="w-20 h-20 rounded-2xl fixed right-10  bottom-28 cursor-pointer " >
  <img src="/search.gif" className="w-15 h-15 rounded-[50%]" alt="" />
  </div>
        </Link>

      {/* Footer Navigation Bar */}
      <div
  className={`fixed bottom-0 left-0 right-0 bg-white p-4 flex justify-evenly rounded-3xl items-center transition-transform duration-300 mx-4 my-2 ${
    showFooter ? "translate-y-0" : "translate-y-[110%]"
  }`}
>
        <Link to="/" className="text-black text-2xl hover:text-blue-300">
          <FaHome />
        </Link>
        <Link to="/chat" className="text-black text-2xl hover:text-blue-300">
          <FaCommentDots />
        </Link>
        <Link
          to="/add-post"
          className="bg-blue-100 text-black p-3 rounded-full shadow-lg text-4xl hover:bg-green-300"
        >
          <MdAddBox />
        </Link>
        <Link to="/InteractedUsersList" className="text-black text-2xl hover:text-blue-300">
          <FaUsers />
        </Link>
        <Link to="/profile" className="text-black text-2xl hover:text-blue-300">
          <FaUser />
        </Link>
      </div>
    </div>
  );
};

export default UserDashboard;
