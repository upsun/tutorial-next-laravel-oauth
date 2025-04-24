'use client'

import React from 'react'
import Link from 'next/link'
import UserDropdown from '@/components/dashboard/user-dropdown' // We will create this next

// Define the User type based on the expected structure from the API
// This should ideally match or be imported from a shared types definition
interface User {
  id: string | number;
  name?: string;
  email?: string;
  avatarUrl?: string;
}

interface NavigationBarProps {
  user: User | null; // User can be null if fetch failed but page still renders
}

export default function NavigationBar ({ user }: NavigationBarProps) {
  return (
    <header className='sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
      <div className='flex h-14 w-full items-center px-6'>
        <div className='mr-4 hidden md:flex'>
          <Link href='/dashboard' className='mr-6 flex items-center space-x-2'>
            {/* Placeholder for Logo */}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
              <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3"/>
            </svg>
            <span className='hidden font-bold sm:inline-block'>Septic Test</span>
          </Link>
          {/* Add other nav links here if needed */}
          {/* <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link href="/features" className="transition-colors hover:text-foreground/80 text-foreground/60">
              Features
            </Link>
          </nav> */}
        </div>

        {/* Mobile Nav Toggle (Optional) */}
        {/* <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:text-accent-foreground h-9 py-2 mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden">
          <svg strokeWidth="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5"><path d="M3 5h18M3 12h18M3 19h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path></svg>
          <span className="sr-only">Toggle Menu</span>
        </button> */}

        <div className='flex flex-1 items-center justify-between space-x-2 md:justify-end'>
          <nav className='flex items-center'>
            {user
              ? (
                  <UserDropdown user={user} />
                )
              : (
                  <Link href='/logout'>
                    {/* Replace with Shadcn Button if available */}
                    <button className='px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700'>
                      Log In
                    </button>
                  </Link>
                )
            }
          </nav>
        </div>
      </div>
    </header>
  )
} 