'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from '@/components/ui/avatar' // Assuming Shadcn UI path
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu' // Assuming Shadcn UI path
import { Button } from '@/components/ui/button' // Assuming Shadcn UI path

// Re-using or importing the User type
interface User {
  id: string | number;
  name?: string;
  email?: string;
  avatarUrl?: string;
}

interface UserDropdownProps {
  user: User;
}

// Helper to get initials from name
function getInitials (name?: string): string {
  if (!name) return 'U' // Default 'User'
  const names = name.split(' ')
  const initials = names.map(n => n[0]).join('')
  return initials.toUpperCase().slice(0, 2) // Max 2 initials
}

export default function UserDropdown ({ user }: UserDropdownProps) {
  const router = useRouter()

  // Logout handler that calls the backend endpoint
  const handleLogout = async () => {
    console.log('Attempting to log out...')
    try {
      const response = await fetch('/logout', { // Use the correct path to your logout endpoint
        method: 'POST',
        headers: {
          // Include headers if needed (e.g., CSRF token if not using standard form post)
          'Content-Type': 'application/json' // Adjust if your endpoint expects different Content-Type
        }
        // No body needed for this simple logout endpoint typically
      })

      if (response.ok) {
        // Check if the server performed a redirect
        if (response.redirected) {
          // The server handled the redirect (to '/' in this case)
          // Use window.location to force a full page refresh and clear client state
          window.location.href = response.url
        } else {
          // Optional: Handle cases where the server responded with 2xx but didn't redirect
          // Might indicate partial success or an unexpected server response.
          // Could manually redirect here if needed, but server redirect is cleaner.
          console.warn('Logout successful, but server did not redirect.')
          router.push('/') // Fallback redirect
          router.refresh() // Ensure state is refreshed
        }
      } else {
        // Handle HTTP errors (e.g., 4xx, 5xx)
        console.error(`Logout failed: ${response.status} ${response.statusText}`)
        // TODO: Show an error message to the user (e.g., using a toast notification)
        alert('Logout failed. Please try again.') // Simple alert for now
      }
    } catch (error) {
      // Handle network errors or other exceptions during fetch
      console.error('An error occurred during logout:', error)
      // TODO: Show an error message to the user
      alert('An error occurred during logout. Please check your connection.') // Simple alert
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            {user.avatarUrl && <AvatarImage src={user.avatarUrl} alt={user.name || 'User avatar'} />}
            <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name || 'User'}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email || 'No email provided'}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {/* Optional Items - Add links/handlers as needed */}
        {/* <DropdownMenuItem onClick={() => router.push('/profile')}>
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push('/settings')}>
          Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator /> */}
        <DropdownMenuItem onClick={handleLogout} className='cursor-pointer'>
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 