"use client"
import React from 'react'
import Image from 'next/image'
import { User } from 'lucide-react'
import { SignInButton, UserButton } from '@clerk/nextjs'
import { useUser } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'

function Header() {
    const { user } = useUser()
    return (
        <div className='flex items-center justify-between p-5 border-b'>
            <div className="flex gap-2 items-center">
                <Image src={"/logo.png"} alt="logo" width={45} height={45}/>
                <h2 className="text-lg font-bold"><span className='text-primary'>Vid</span>Course</h2>
            </div>
            <ul className='flex gap-10 items-center'>
                <li className='text-lg hover:text-primary font-medium cursor-pointer'>Home</li>
                <li className='text-lg hover:text-primary font-medium cursor-pointer'>Pricing</li>
            </ul>

            {user ?
            <UserButton/>:
            <SignInButton mode='modal'>
                <Button>Get Started</Button>
            </SignInButton>
        }
        </div>
    )
}

export default Header