import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET (request: Request) {
  const cookieStore = await cookies()
  const storedState = cookieStore.get('oauth_state')?.value
  const storedCodeVerifier = cookieStore.get('oauth_code_verifier')?.value

  // Clear cookies immediately after retrieval
  cookieStore.delete('oauth_state')
  cookieStore.delete('oauth_code_verifier')
  

  try {
    const { searchParams } = new URL(request.url)
    const state = searchParams.get('state')
    const code = searchParams.get('code')
    const error = searchParams.get('error')

    // Handle potential errors returned from the authorization server
    if (error) {
      const errorDescription = searchParams.get('error_description') || 'Unknown error from auth server.'
      console.error(`OAuth Error: ${error}, Description: ${errorDescription}`)
      // Redirect user to an error page or show an error message
      // Example: return NextResponse.redirect(new URL('/login?error=oauth_failed', request.url))
      return NextResponse.json({ error: 'OAuth authorization failed.', details: errorDescription }, { status: 400 })
    }

    // --- State Validation ---
    if (!storedState) {
      console.error('Missing stored OAuth state cookie.')
      return NextResponse.json({ error: 'Invalid request: Missing state cookie.' }, { status: 400 })
    }

    if (!state) {
      console.error('Missing state parameter in callback request.')
      return NextResponse.json({ error: 'Invalid request: Missing state parameter.' }, { status: 400 })
    }

    if (storedState !== state) {
      console.error(`Invalid state parameter: mismatch. Stored: ${storedState}, Received: ${state}`)
      return NextResponse.json({ error: 'Invalid state parameter.' }, { status: 400 })
    }

    // --- Code and Verifier Checks ---
    if (!code) {
      console.error('Missing code parameter in callback request.')
      return NextResponse.json({ error: 'Invalid request: Missing code parameter.' }, { status: 400 })
    }

    if (!storedCodeVerifier) {
      console.error('Missing stored code_verifier cookie.')
      // This could happen if the cookie expired or was cleared prematurely
      return NextResponse.json({ error: 'Invalid request: Missing code verifier.' }, { status: 400 })
    }

    // --- Environment Variable Checks ---
    const clientId = process.env.OAUTH_CLIENT_ID
    const redirectUri = process.env.OAUTH_REDIRECT_URI // Must match exactly what was sent in /redirect
    const tokenUrl = process.env.OAUTH_TOKEN_URI

    if (!clientId || !redirectUri || !tokenUrl) {
      console.error('Missing OAuth environment variables (OAUTH_CLIENT_ID, OAUTH_REDIRECT_URI, OAUTH_TOKEN_URI)')
      return NextResponse.json({ error: 'Server configuration error.' }, { status: 500 })
    }

    // --- Token Exchange ---
    const params = new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: clientId,
      redirect_uri: redirectUri,
      code,
      code_verifier: storedCodeVerifier
    })

    const tokenResponse = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params.toString()
    })

    // --- Handle Token Response ---
    const tokenData = await tokenResponse.json()

    if (!tokenResponse.ok) {
      console.error('Failed to fetch OAuth tokens:', tokenData)
      const errorMessage = tokenData.error_description || tokenData.error || 'Failed to exchange code for token.'
      // Provide more specific error if possible
      const status = tokenResponse.status >= 400 && tokenResponse.status < 500 ? 400 : 500
      return NextResponse.json({ error: errorMessage }, { status })
    }

    // --- Success --- 
    // At this point, you have the tokens in tokenData (e.g., access_token, refresh_token, id_token)
    if (process.env.NODE_ENV === 'development') {
      console.log('Successfully obtained tokens:', tokenData) // Log for debugging, remove sensitive data in production
    }

    cookieStore.set('access_token', tokenData.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: tokenData.expires_in // Use token's expiration time
    });

    return NextResponse.redirect(new URL('/dashboard', process.env.NEXT_PUBLIC_BASE_URL))

  } catch (error) {
    console.error('Error during OAuth callback:', error)
    // Return a generic error response to the client
    return NextResponse.json({ error: 'An unexpected error occurred during callback processing.' }, { status: 500 })
  }
} 