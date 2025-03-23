import React, { useEffect, useState } from 'react'
import { axiosInstance } from '../lib/axios'



const InteractedUsersList = () => {
    const [interactedUsers,setInteractedUsers]=useState([])
    const fetchInteractedUsers= async()=>{
        try {
            const {data}= await axiosInstance.get('/userdash/getAccountInteractions')
            console.log("data",data.interactedUsers
            );
            setInteractedUsers(data.interactedUsers)
            
        } catch (e) {
            
        }
    }

    useEffect(() => {
      
    fetchInteractedUsers()
      
    }, [])
    
  return <>
  
  <div className="p-4 max-w-lg mx-auto w-full h-screen">
      <h2 className="text-xl font-bold mb-4">Interacted Users</h2>
      <div className="space-y-4">
        {interactedUsers.map((user) => (
          <div
            key={user._id}
            className="flex items-center p-4 bg-white shadow-md rounded-lg"
          >
            <img
              src={user.userId.profilePic}
              alt={user.userId.fullName}
              className="w-12 h-12 rounded-full mr-4"
            />
            <div>
              <h3 className="text-lg font-semibold">{user.userId.fullName}</h3>
              <p className="text-gray-500">{user.userId.email}</p>
              {user.follow && (
                <p className="text-blue-500 font-medium">{user.follow}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  
  
  </>
}

export default InteractedUsersList