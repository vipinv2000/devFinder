import React, { useEffect, useState } from 'react'
import { useAuthStore } from '../store/useAuthStore';
import { useParams } from 'react-router-dom';

const DevProfile = () => {
    const { followingCount, followersCount,developerDetails,developerposts, fetchDeveloperDetailes } = useAuthStore();
    const { devId } = useParams();
    console.log(devId);
    
    useEffect(() => {
        fetchDeveloperDetailes(devId)
    }, [])

    return (
        <div className='pt-20'>
            <h1>Follwers {followersCount}</h1>
            <h2>Following {followingCount}</h2>
        </div>
        
    )
}

export default DevProfile