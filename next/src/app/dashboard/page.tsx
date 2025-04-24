import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import NavigationBar from '@/components/dashboard/navigation-bar'

// Define a type for the user data we expect from the API
interface UserData {
  id: string | number; // Adjust based on your API
  name?: string;
  email?: string;
  avatarUrl?: string;
  // Add other relevant user fields
}

async function getUserData (token: string | undefined): Promise<UserData | null> {
  const apiEndpoint = process.env.API_ENDPOINT
  if (!apiEndpoint) {
    console.error('API_ENDPOINT environment variable is not set.')
    return null
  }
  if (!token) {
    console.error('No access token provided to getUserData.')
    return null
  }

  try {
    const response = await fetch(`${apiEndpoint}/user`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json'
      }
    })

    if (response.status === 401) {
      console.error('Unauthorized: Invalid or expired token.')
      return null
    }

    if (!response.ok) {
      console.error(`Failed to fetch user data: ${response.status} ${response.statusText}`)
      return null
    }

    const userData: UserData = await response.json()
    return userData
  } catch (error) {
    console.error('Network or other error fetching user data:', error)
    return null
  }
}

export default async function DashboardPage () {
  const cookieStore = await cookies()
  const accessToken = await cookieStore.get('access_token')?.value

  if (!accessToken) {
    console.log('No access token cookie found, redirecting to /login')
    redirect('/oauth/redirect')
  }

  const userData = await getUserData(accessToken)

  if (!userData) {
    console.log('Failed to fetch user data or token invalid, redirecting to /login')
    // Consider more nuanced error handling before deleting the cookie
    // Maybe redirect to login but keep the cookie for debugging?
    // cookieStore.delete('access_token')
    redirect('/oauth/redirect')
  }

  return (
    <div className='min-h-screen flex flex-col bg-gray-50'>
      <NavigationBar user={userData} />
      <main className='flex-grow p-6'>
        <h1 className='text-3xl font-semibold mb-6'>Dashboard</h1>
        <div className='bg-white p-6 rounded-lg shadow-md'>
          <p className='text-xl'>
            Welcome back, <span className='font-medium'>{userData?.name || 'User'}</span>!
          </p>
          <p className='text-sm text-gray-600 mt-2'>
            Your email: {userData?.email || 'Not available'}
          </p>
          <div className='mt-6 border-t pt-4'>
            <h2 className='text-lg font-semibold mb-2'>Your Stats</h2>
            <p className='text-gray-700'>Stats will go here...</p>
          </div>
        </div>
      </main>
      <footer className='p-4 text-center text-sm text-gray-500 border-t bg-white'>
        © {new Date().getFullYear()} Upsun Test Inc.
      </footer>
    </div>
  )
}
