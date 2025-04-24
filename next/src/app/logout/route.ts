import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

// Handle POST requests for logging out
export async function POST () {
  try {
    const cookieStore = await cookies()

    // Define cookie options for deletion (path is important)
    const cookieOptions = {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production'
      // maxAge: 0 // Setting maxAge to 0 can also work for deletion
    }

    await fetch(process.env.OAUTH_LOGOUT_URI || '', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    // Delete the main access token cookie
    cookieStore.delete('access_token', cookieOptions)

    // Attempt to delete OAuth state/verifier cookies as a cleanup measure
    cookieStore.delete('oauth_state', cookieOptions)
    cookieStore.delete('oauth_code_verifier', cookieOptions)

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


