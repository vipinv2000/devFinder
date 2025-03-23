import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaCommentDots, FaSearch, FaUser, FaUsers, FaPlusCircle, FaHome } from "react-icons/fa";
import { MdAddBox } from "react-icons/md"; // Modern Add Post icon
import { axiosInstance } from "../lib/axios";

const UserDashboard = () => {
  const [stories, setStories] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [showFooter, setShowFooter] = useState(false);

  const loadedPostIds = new Set();

  useEffect(() => {
    fetchStories();
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [page]);

  const fetchStories = async () => {
    try {
      const response = await axiosInstance.get("/userdash/getStory");
      if (Array.isArray(response.data.story)) {
        const formattedStories = response.data.story.flatMap(item => item.story || []);
        setStories(formattedStories);
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
      const newPosts = response.data.posts.filter(post => !loadedPostIds.has(post._id));

      if (newPosts.length === 0) {
        setHasMore(false);
      } else {
        newPosts.forEach(post => loadedPostIds.add(post._id));
        setPosts(prev => [...prev, ...newPosts]);
      }
      setLoading(false);
    } catch (error) {
      setError(true);
      setLoading(false);
    }
  };

  const handleLike = async (postId) => {
    try {
      await axiosInstance.post(`/userdash/likePost/${postId}`);
      setPosts(prev =>
        prev.map(post => ({
          ...post,
          posts: post.posts.map(p =>
            p._id === postId ? { ...p, likes: (p.likes || 0) + 1 } : p
          ),
        }))
      );
    } catch (error) {
      console.error("Error liking post:", error);
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
    const screenHeight = window.innerHeight;
    if (event.clientY > screenHeight - 100) {
      setShowFooter(true);
    } else {
      setShowFooter(false);
    }
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="bg-gray-900 text-white min-h-screen p-6 relative">

      <div className="relative flex items-center gap-4 overflow-x-auto p-4 border-b border-gray-700 bg-gray-800 rounded-md shadow-md mb-6 rounded-b-xl">
        <Link to="/add-story" className="flex flex-col items-center">
          <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center">
            <FaPlusCircle className="text-3xl text-blue-500" />
          </div>
          <p className="text-sm">Add Story</p>
        </Link>

        {stories.map((story, index) => (
          <div key={index} className="flex flex-col items-center">
            <img src={story.image} alt="story" className="w-16 h-16 rounded-full border-2 border-blue-500" />
            <p className="text-sm">{story.caption}</p>
          </div>
        ))}
      </div>

      {/* Posts Section */}
      {error && <p className="text-center text-red-500">Failed to load posts. Please try again.</p>}

      <div>
      {posts.map((post) =>
  post.posts?.map((singlePost, index) => (
    <div
      key={index}
      className={`mb-6 p-5 rounded-lg shadow-md border ${
        singlePost.isPrivate ? "border-red-500" : "border-gray-700"
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
        <div className="flex items-center text-red-400 mt-2">
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
  ))
)}


      </div>

    
      <div
        className={`fixed bottom-0 left-0 right-0 bg-blue-900 p-4 flex justify-evenly rounded-3xl items-center transition-transform duration-300 ${
          showFooter ? "translate-y-0" : "translate-y-full"
        }`}
      >
        

        <Link to="/" className="text-white text-2xl hover:text-blue-300">
          <FaHome/>
        </Link>

        <Link to="/chat" className="text-white text-2xl hover:text-blue-300">
          <FaCommentDots />
        </Link>

        {/* Centered Add Post Button */}
        <Link
          to="/add-post"
          className="bg-blue-500 text-white p-3 rounded-full shadow-lg text-4xl hover:bg-blue-600"
        >
          <MdAddBox />
        </Link>

        <Link to="/friends" className="text-white text-2xl hover:text-blue-300">
          <FaUsers />
        </Link>
        <Link to="/profile" className="text-white text-2xl hover:text-blue-300">
          <FaUser />
        </Link>
      </div>
    </div>
  );
};

export default UserDashboard;
