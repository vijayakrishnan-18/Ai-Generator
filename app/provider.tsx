"use client"
import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { UserDetailContext } from '@/context/UserDetailContext';
// Assuming you are using Clerk based on the suggestion
import { useUser } from '@clerk/nextjs'; 

function Provider({ children }: { children: React.ReactNode }) {
    const [userDetail, setUserDetail] = useState(null);
    const { user, isLoaded, isSignedIn } = useUser(); // Clerk hook

    useEffect(() => {
        // Only run if Clerk has loaded and the user is signed in
        if (isLoaded && isSignedIn) {
            CreateNewUser();
        }
    }, [user, isLoaded, isSignedIn])

    const CreateNewUser = async () => {
        try {
            const result = await axios.post('/api/user', {
                userEmail: user?.primaryEmailAddress?.emailAddress,
                userName: user?.fullName
            });
            setUserDetail(result?.data);
        } catch (error) {
            console.error("Error creating/fetching user:", error);
            // Handle failure gracefully (e.g., redirect or show a toast)
        }
    }

    return (
        <UserDetailContext.Provider value={{ userDetail, setUserDetail }}>
            {children}
        </UserDetailContext.Provider>
    )
}

export default Provider