import React, { useEffect, useState } from 'react'
import { useAuthStore } from '../store/useAuthStore';
import { useNavigate, useParams } from 'react-router-dom';
import { IoGridOutline } from "react-icons/io5";
import { GiShadowFollower } from "react-icons/gi";
import { SlUserFollowing } from "react-icons/sl";
import Feedpost from '../components/Feedpost';
import { FaRegMessage } from "react-icons/fa6";
import { AiOutlineUserAdd } from "react-icons/ai";
import { Bookmark, GitPullRequestClosed, Handshake, TriangleAlert } from 'lucide-react';
import { useChatStore } from '../store/useChatStore';

const DevProfile = () => {
    const { followingCount, followersCount, developerDetails, developerposts, status, isYou, fetchDeveloperDetailes,
        get_Folowing_Developers, following_developers_list, followers_list, get_Followers_Developers, send_Follow_Request_To_deVeloper
    } = useAuthStore();
    const {  selectedUser, setSelectedUser } = useChatStore();
    const { devId } = useParams();
    const [activeBar, setactiveBar] = useState("post")
    const navigate = useNavigate()
    const [refresh, setRefresh] = useState(false)

    const followReuest = async (id, type) => {
        send_Follow_Request_To_deVeloper(id, type);
        fetchDeveloperDetailes(devId);
        setRefresh(!refresh);
    }


    useEffect(() => {
        fetchDeveloperDetailes(devId)
    }, [activeBar, refresh])




    return (
        <div className='pt-20 flex items-end justify-center bg-gray-900'>
            <div className=' w-[80%] flex flex-col items-center justify-center gap-8 pb-5'>
                <div className='w-full flex items-center justify-evenly gap-36 p-5'>
                    <div className='w-[50%] flex items-center justify-end'>
                        {
                            developerDetails?.profilePic != "" ? <img className='h-40 w-40 rounded-full' src={developerDetails?.profilePic} alt="profile" />
                                : <img className='h-40 w-40 rounded-full' src="https://media.istockphoto.com/id/1130884625/vector/user-member-vector-icon-for-ui-user-interface-or-profile-face-avatar-app-in-circle-design.jpg?s=612x612&w=0&k=20&c=1ky-gNHiS2iyLsUPQkxAtPBWH1BZt0PKBB1WBtxQJRE=" alt="profile" />
                        }

                    </div>
                    <div className='w-[50%] flex flex-col gap-8 text-white'>
                        <div>
                            <p className='text-[33px] font-extrabold m-0 p-0'>{developerDetails && developerDetails.fullName}</p>
                            <p className='text-[16px] font-extrabold m-0 p-0 italic'>{developerDetails && developerDetails.email}</p>
                        </div>
                        <div className=' w-full flex justify-start items-center gap-11 text-white'>
                            <p className='text-[19px] font-extrabold '>{developerposts && developerposts.length} post</p>
                            <p className='text-[19px] font-extrabold'>{followersCount} followers</p>
                            <p className='text-[19px] font-extrabold'>{followingCount} following</p>
                        </div>
                        <div className='w-full flex justify-start items-center gap-11'>

                            {isYou ? (
                                <h1 className='italic text-[14px]'>Your profile...</h1>
                            ) : (
                                <div>
                                    {status === "following" && (
                                        <button 
                                        onClick={()=>{
                                            setSelectedUser(developerDetails)
                                            navigate('/chat')
                                        }}
                                        className='cursor-pointer flex items-center justify-center gap-2 bg-gray-300 px-3 py-1 opacity-70 rounded-lg'>
                                            <FaRegMessage className='font-extrabold text-black' />
                                            <span className='font-extrabold'>Message</span>
                                        </button>
                                    )}

                                    {status === "pending" && (
                                        <button
                                            onClick={() => followReuest(developerDetails._id, "followback")}
                                            className='cursor-pointer flex items-center justify-center gap-2 bg-blue-800 px-3 py-1 opacity-70 rounded-lg'
                                        >

                                            <Handshake className='font-extrabold text-black' />
                                            <span className='font-extrabold'>Follow Back</span>
                                        </button>
                                    )}

                                    {status === "requested" && (
                                        <button
                                            className='flex items-center justify-center gap-2 bg-red-600 px-3 py-1 opacity-70 rounded-lg'
                                        >
                                            <Bookmark className='font-extrabold text-white' />
                                            <span className='font-extrabold'>already requested</span>
                                        </button>
                                    )}

                                    {status === "sendRequest" && (
                                        <button
                                            onClick={() => followReuest(developerDetails._id, "request")}
                                            className='flex items-center justify-center gap-2 bg-blue-600 px-3 py-1 opacity-70 rounded-lg'
                                        >
                                            <AiOutlineUserAdd className='font-extrabold text-white' />
                                            <span className='font-extrabold'>request</span>
                                        </button>
                                    )}

                                    {status === "reject" && (
                                        <button
                                            onClick={() => followReuest(developerDetails._id, "unblock")}
                                            className='flex items-center justify-center gap-2 bg-yellow-500 px-3 py-1 opacity-70 rounded-lg'
                                        >
                                            <GitPullRequestClosed className='font-extrabold text-black' />
                                            <span className='font-extrabold'>un block</span>
                                        </button>
                                    )}

                                    {status === "blocked" && (
                                        <button

                                            className='flex items-center justify-center gap-2  px-3 py-1 opacity-70 rounded-lg'
                                        >
                                            <TriangleAlert size={20} className='font-extrabold text-red-600' />
                                            <span className='font-extrabold text-red-600'>You were blocked</span>
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>

                    </div>
                </div>
                <div className='border border-bg border-gray-300 w-[60%] '></div>
                <div className='flex items-center justify-center gap-28 pb-5 text-white'>
                    <div className='flex flex-col gap-2'>
                        <p onClick={() => setactiveBar("post")} className='text-[19px] font-extrabold flex items-center justify-center gap-2'><IoGridOutline /> post</p>
                        {
                            activeBar === "post" && <div className='border border-bg border-gray-300 w-full '></div>
                        }
                    </div>
                    <div className='flex flex-col gap-2'>
                        <p onClick={() => {
                            setactiveBar("followers")
                            get_Followers_Developers(devId)
                        }} className='cursor-pointer text-[19px] font-extrabold flex items-center justify-center gap-2'><GiShadowFollower /> followers</p>
                        {
                            activeBar === "followers" && <div className='border border-bg border-gray-300 w-full '></div>
                        }
                    </div>
                    <div className='flex flex-col gap-2'>
                        <p onClick={() => {
                            setactiveBar("following")
                            get_Folowing_Developers(devId)
                        }} className='cursor-pointer text-[19px] font-extrabold flex items-center justify-center gap-2'><SlUserFollowing /> following</p>
                        {
                            activeBar === "following" && <div className='border border-bg border-gray-300 w-full '></div>
                        }
                    </div>

                </div>
                <div className='w-full h-auto flex flex-col items-center justify-start min-h-screen'>
                    {activeBar === "post" && (
                        developerposts && developerposts.length > 0 ? (
                            developerposts.map((item, index) => (
                                <Feedpost
                                    singlePost={item}
                                    isprofile={true}
                                    toggleRefresh={{ refresh, setRefresh }}
                                    key={index}
                                />
                            ))
                        ) : (
                            <div>
                                <h1>No Post Found</h1>
                            </div>
                        )
                    )}


                    {
                        activeBar === "followers" && <div className={`w-[50%] mb-6 px-5 py-2 `} >
                            {
                                followers_list && followers_list.length > 0 ? (
                                    followers_list.map((item, index) => (
                                        <div key={index} className='flex items-center justify-between bg-gray-700 px-5 py-2 rounded-lg m-3'>
                                            <div className='flex items-center gap-4'>
                                                <img className='h-12 w-12 rounded-full' src={item.profilePic} alt="" />
                                                <div className='flex flex-col items-center justify-start'>
                                                    <p className='text-white text-[18px] italic'>{item.fullName}</p>
                                                </div>
                                            </div>

                                            <div>
                                                <div className='flex flex-col items-center justify-start'>
                                                    <button
                                                        onClick={() => {
                                                            navigate(`/devProfile/${item._id}`);
                                                            setactiveBar("post");
                                                        }}
                                                        className='text-white text-[18px] px-3 py-1 rounded-lg cursor-pointer bg-blue-600'
                                                    >
                                                        View More
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-black text-center ">No followers  found</div>
                                )
                            }

                        </div>
                    }
                    {
                        activeBar === "following" && (
                            <div className="w-[50%] mb-6 px-5 py-2">
                                {following_developers_list && following_developers_list.length > 0 ? (
                                    following_developers_list.map((item, index) => (
                                        <div key={index} className="flex items-center justify-between bg-gray-700 px-5 py-2 rounded-lg m-3">
                                            <div className="flex items-center gap-4">
                                                <img className="h-12 w-12 rounded-full" src={item?.userId?.profilePic || "/default-profile.jpg"} alt="" />
                                                <div className="flex flex-col items-center justify-start">
                                                    <p className="text-white text-[18px] italic">{item?.userId?.fullName || "Unknown User"}</p>
                                                </div>
                                            </div>

                                            <div>
                                                <div className="flex flex-col items-center justify-start">
                                                    <button
                                                        onClick={() => {
                                                            navigate(`/devProfile/${item?.userId?._id}`);
                                                            setactiveBar("post");
                                                        }}
                                                        className="text-white text-[18px] px-3 py-1 rounded-lg cursor-pointer bg-blue-600"
                                                    >
                                                        View More
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-black text-center ">No following developers found</div>
                                )}
                            </div>
                        )}



                </div>
            </div>
        </div >

    )
}

export default DevProfile