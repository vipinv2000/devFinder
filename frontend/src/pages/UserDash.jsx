import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaCommentDots, FaSearch, FaUser, FaUsers, FaPlusCircle, FaHome } from "react-icons/fa";
import { MdAddBox } from "react-icons/md"; // Modern Add Post icon
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


      <div className="relative flex items-center gap-4 overflow-x-auto p-4 border-b border-gray-500 bg-gray-600  shadow-md mb-6 rounded-xl">
        <Link to="/add-story" className="flex flex-col items-center">
          <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center">
            <FaPlusCircle className="text-3xl text-blue-500" />
          </div>
          <p className="text-sm">Add Story</p>
        </Link>

        {stories.map((story, index) => (
          <div key={index} className="flex flex-col items-center">
            <img src={story.image} alt="story" className="w-16 h-16 rounded-full border-2 border-black" />
            <p className="text-sm">{story.caption}</p>
          </div>
        ))}
      </div>

      {/* Posts Section */}
      {error && <p className="text-center text-red-500">Failed to load posts. Please try again.</p>}

      <div>
      {posts.map((post) =>
  post.posts?.map((singlePost, index) => (
    <Feedpost singlePost={singlePost} post={post} key={index}/>
  ))
)}


      </div>
      <Link to="/chooseDeveloper" className="text-black text-2xl hover:text-blue-300">
      <div className="w-20 h-20 rounded-2xl fixed right-10  bottom-28 cursor-pointer " >
  <img src="/search.gif" className="w-15 h-15 rounded-[50%]" alt="" />
  </div>
        </Link>

    
      <div
        className={`fixed bottom-0 left-0 right-0 bg-white p-4 flex justify-evenly rounded-3xl items-center transition-transform duration-300 mx-4 my-2 ${
          showFooter ? "translate-y-0" : "translate-y-full"
        }`}
      >
        

        <Link to="/" className="text-black text-2xl hover:text-blue-300">
          <FaHome/>
        </Link>

        <Link to="/chat" className="text-black text-2xl hover:text-blue-300">
          <FaCommentDots />
        </Link>

        {/* Centered Add Post Button */}
        <Link
          to="/add-post"
          className="bg-blue-100 text-black p-3 rounded-full shadow-lg text-4xl hover:bg-green-300  "
        >
          <MdAddBox />
        </Link>

        <Link to="/friends" className="text-black text-2xl hover:text-blue-300">
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
