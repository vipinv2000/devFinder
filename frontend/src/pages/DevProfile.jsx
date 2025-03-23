import React, { useEffect, useState } from 'react'
import { useAuthStore } from '../store/useAuthStore';
import { useParams } from 'react-router-dom';
import { IoGridOutline } from "react-icons/io5";
import { GiShadowFollower } from "react-icons/gi";
import { SlUserFollowing } from "react-icons/sl";

const DevProfile = () => {
    const { followingCount, followersCount, developerDetails, developerposts, fetchDeveloperDetailes } = useAuthStore();
    const { devId } = useParams();
    const [activeBar, setactiveBar] = useState("post")


    useEffect(() => {
        fetchDeveloperDetailes(devId)
    }, [])

    return (
        <div className='pt-20 flex items-end justify-center'>
            <div className=' w-[80%] flex flex-col items-center justify-center gap-8'>
                <div className='w-full flex items-center justify-evenly gap-36 p-5'>
                    <div className='w-[50%] flex items-center justify-end'>
                        <img className='h-40 w-40 rounded-full' src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dXNlcnxlbnwwfHwwfHx8MA%3D%3D" alt="" />
                    </div>
                    <div className='w-[50%] flex flex-col gap-8'>
                        <div>
                            <p className='text-[33px] font-extrabold m-0 p-0'>{developerDetails && developerDetails.fullName}</p>
                            <p className='text-[16px] font-extrabold m-0 p-0 italic'>{developerDetails && developerDetails.email}</p>
                        </div>
                        <div className=' w-full flex justify-start items-center gap-11'>
                            <p className='text-[19px] font-extrabold '>{developerposts && developerposts.length} post</p>
                            <p className='text-[19px] font-extrabold'>{followersCount} followers</p>
                            <p className='text-[19px] font-extrabold'>{followingCount} following</p>
                        </div>
                    </div>
                </div>
                <div className='border border-bg border-gray-300 w-[60%] '></div>
                <div className='flex items-center justify-center gap-28 pb-5'>
                    <div className='flex flex-col gap-2'>
                        <p onClick={()=>setactiveBar("post")} className='text-[19px] font-extrabold flex items-center justify-center gap-2'><IoGridOutline /> post</p>
                        {
                            activeBar === "post" && <div className='border border-bg border-gray-300 w-full '></div>
                        }
                    </div>
                    <div className='flex flex-col gap-2'>
                        <p onClick={()=>setactiveBar("followers")} className='text-[19px] font-extrabold flex items-center justify-center gap-2'><GiShadowFollower /> followers</p>
                        {
                            activeBar === "followers" && <div className='border border-bg border-gray-300 w-full '></div>
                        }
                    </div>
                    <div className='flex flex-col gap-2'>
                        <p onClick={()=>setactiveBar("following")} className='text-[19px] font-extrabold flex items-center justify-center gap-2'><SlUserFollowing /> following</p>
                        {
                            activeBar === "following" && <div className='border border-bg border-gray-300 w-full '></div>
                        }
                    </div>

                </div>
            </div>
        </div>

    )
}

export default DevProfile