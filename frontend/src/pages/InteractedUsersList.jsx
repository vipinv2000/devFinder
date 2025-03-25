import React, { useEffect, useState } from "react";
import { axiosInstance } from "../lib/axios";
import { MessageCircle, Check, X, MessageSquare } from "lucide-react";

const InteractedUsersList = () => {
  const [interactedUsers, setInteractedUsers] = useState([]);

  const fetchInteractedUsers = async () => {
    try {
      const { data } = await axiosInstance.get("/userdash/getAccountInteractions");
      setInteractedUsers(data.interactedUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleRequest=async(userId,type)=>{
    try { 
      await axiosInstance.patch(`/userdash/acceptFollowRequest/${userId}/${type}`)
      setInteractedUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.userId._id === userId ? { ...user, follow: type } : user
        )
      );
    } catch (e) {
      console.error("Error updating follow request:", error);
    }
  }

  useEffect(() => {
    fetchInteractedUsers();
  }, []);

  return (
    <div className="p-4  mx-auto w-full min-h-screen bg-gray-900 px-24 ">
      <h2 className="text-2xl font-bold mb-6 text-center text-white">Your Activities</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
        {interactedUsers.map((user) => (
          <div
            key={user._id}
            className="flex flex-col items-center p-4 bg-white shadow-lg rounded-2xl border border-gray-200 "
          >
            <img
              src={user.userId.profilePic}
              alt={user.userId.fullName}
              className="w-16 h-16 rounded-full mb-3"
            />
            <h3 className="text-lg font-semibold">{user.userId.fullName}</h3>
            <p className="text-gray-500 text-sm">{user.userId.email}</p>
            {user.follow && (
             <p className={`font-medium mt-1 ${user.follow === "blocked" ? "text-red-500" : "text-blue-500"}`}>
             {user.follow}
           </p>
           
            )}

            {/* Dynamic Actions */}
            <div className="mt-4">
              {user.follow === "following" && (
               <button className="p-2 bg-blue-100 hover:bg-blue-200 rounded-full">
               <MessageSquare className="w-6 h-6 text-blue-500" />
             </button>
              )}

              {user.follow === "requested" && (
                <div className="flex gap-2">
                  <button className="px-3 py-1 bg-green-500 text-white rounded-lg flex items-center gap-1"onClick={() => handleRequest(user.userId._id,"following")} >
                    <Check size={16} /> Accept
                  </button>
                  <button className="px-3 py-1 bg-red-500 text-white rounded-lg flex items-center gap-1"onClick={() => handleRequest(user.userId._id,"block")}>
                    <X size={16} /> Reject
                  </button>
                </div>
              )}

              {user.follow === "pending" && (
                <button className="mt-2 px-3 py-1 bg-yellow-500 text-white rounded-lg">
                 Inspect
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InteractedUsersList;
