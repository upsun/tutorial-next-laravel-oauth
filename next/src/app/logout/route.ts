import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

// Handle POST requests for logging out
export async function POST () {
  try {
    const cookieStore = await cookies()

    await fetch(process.env.OAUTH_LOGOUT_URI || '', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    // Delete the main access token cookie
    cookieStore.delete('access_token')

    // Attempt to delete OAuth state/verifier cookies as a cleanup measure
    cookieStore.delete('oauth_state')
    cookieStore.delete('oauth_code_verifier')

    // Get the base URL from the request
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL

    // Redirect to the homepage
    return NextResponse.redirect(baseUrl + '/', {
      status: 302 // Use 302 Found for temporary redirect after action
    })
  } catch (error) {
    console.error('Error during logout:', error)
    // Return a generic error if something goes wrong
    return NextResponse.json({ error: 'Logout failed.' }, { status: 500 })
  }
}


