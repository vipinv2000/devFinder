import Navbar from "./components/Navbar";

import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import SettingsPage from "./pages/SettingsPage";
import ProfilePage from "./pages/ProfilePage";
import UserDashboard from "./pages/UserDash.jsx";

import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "./store/useAuthStore";
import { useThemeStore } from "./store/useThemeStore";
import { useEffect } from "react";

import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";

import ChooseDeveloper from "./pages/ChooseDeveloper";
import DevProfile from "./pages/DevProfile";

import AddPost from "./pages/Addpost.jsx";
import AddStory from "./pages/Addstory.jsx";
import InteractedUsersList from "./pages/InteractedUsersList.jsx";


const App = () => {
  const { authUser, checkAuth, isCheckingAuth, onlineUsers } = useAuthStore();
  const { theme } = useThemeStore();
  const location = useLocation(); // Get current route path

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth && !authUser)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );

  return (
    <div data-theme={theme} >
    
    {!["/", "/add-story", "/add-post","/chooseDeveloper","/InteractedUsersList"].includes(location.pathname) && <Navbar />}


      <Routes>
        <Route path="/chat" element={authUser ? <HomePage /> : <Navigate to="/login" />} />
        <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/" />} />
        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/profile" element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />
        <Route path="/chooseDeveloper" element={authUser ? <ChooseDeveloper /> : <Navigate to="/login" />} />
        <Route path="/devProfile/:devId" element={authUser ? <DevProfile /> : <Navigate to="/login" />} />
        <Route path="/" element={authUser ? <UserDashboard /> : <Navigate to="/login" />} />
        <Route path="/add-post" element={<AddPost />} />
        <Route path="/add-story" element={<AddStory />} />
        <Route path="/InteractedUsersList" element={<InteractedUsersList />} />

      </Routes>

      <Toaster />
    </div>
  );
};

export default App;
