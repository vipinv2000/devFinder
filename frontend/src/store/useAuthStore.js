import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5001" : "/";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],
  socket: null,
  developersLis: null,
  totalDevelopers: null,
  developerDetails: null,
  followingCount: null,
  followersCount: null,
  developerposts: null,
  isfriend: null,
  following_developers_list: null,
  followers_list: null,
  refresh: false,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");

      set({ authUser: res.data });
      get().connectSocket();
    } catch (error) {
      console.log("Error in checkAuth:", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data });
      toast.success("Account created successfully");
      get().connectSocket();
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });
      toast.success("Logged in successfully");

      get().connectSocket();
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logged out successfully");
      get().disconnectSocket();
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      set({ authUser: res.data });
      toast.success("Profile updated successfully");
    } catch (error) {
      console.log("error in update profile:", error);
      toast.error(error.response.data.message);
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  connectSocket: () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) return;

    const socket = io(BASE_URL, {
      query: {
        userId: authUser._id,
      },
    });
    socket.connect();

    set({ socket: socket });

    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });
  },
  disconnectSocket: () => {
    if (get().socket?.connected) get().socket.disconnect();
  },
  getDeveloperToDisplay: async (page = 1) => {
    try {
      const res = await axiosInstance.get(`/userdash/getDevelopers?page=${page}`);
      console.log("List of users", res.data.developers);

      set({
        developersList: res.data.developers,
        totalDevelopers: res.data.totalDevelopers // Store total count
      });
    } catch (error) {
      console.log("Error in fetching developers:", error);
    }
  },
  fetchDeveloperDetailes: async (devId) => {
    try {
      const res = await axiosInstance.get(`/userdash/getDeveloperProfile/${devId}`);
      console.log("Developer Details", res.data);
      set({
        developerDetails: res.data.user,
        followingCount: res.data.followingCount,
        followersCount: res.data.followersCount,
        developerposts: res.data.posts,
        status: res.data.status,
        isYou: res.data.isYou
      });
    } catch (error) {
      console.log("Error in fetching developers:", error);
    }
  },

  get_Folowing_Developers: async (devId) => {
    try {
      const res = await axiosInstance.get(`/userdash/getfollowingDevelopers/${devId}`);
      console.log("following Details", res.data.GetFollwingdev);
      set({
        following_developers_list: res.data.GetFollwingdev
      });
    } catch (error) {
      console.log("Error in fetching developers:", error);
    }
  },
  get_Followers_Developers: async (devId) => {
    try {
      const res = await axiosInstance.get(`/userdash/getfollowers/${devId}`);
      console.log("followers", res.data.followers);
      set({
        followers_list: res.data.followers
      });
    } catch (error) {
      console.log("Error in fetching developers:", error);
    }
  },
  Do_User_Post_Like: async (postId, collectionId) => {
    try {
      const res = await axiosInstance.get(`/userdash/DoPostLike/${postId}/${collectionId}`);

    } catch (error) {
      console.log("Error in fetching developers:", error);
    }
  },
  send_Follow_Request_To_deVeloper: async(devId,type) => {
    try {
      const res = await axiosInstance.patch(`/userdash/requestFollow/${devId}/${type}`);

    } catch (error) {
      console.log("Error in fetching developers:", error);
    }
  }
}));
