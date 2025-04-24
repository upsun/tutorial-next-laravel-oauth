import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import crypto from 'node:crypto'

export async function GET () {
  try {
    const state = crypto.randomBytes(20).toString('hex') // 40 chars
    const codeVerifier = crypto.randomBytes(64).toString('hex') // 128 chars

    const codeChallenge = crypto
      .createHash('sha256')
      .update(codeVerifier)
      .digest('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '') // Base64url encoding

    const cookieStore = await cookies()
    const secure = process.env.NODE_ENV === 'production'
    const cookieOptions = {
      httpOnly: true,
      secure,
      path: '/',
      maxAge: 60 * 15 // 15 minutes
    }

    cookieStore.set('oauth_state', state, cookieOptions)
    cookieStore.set('oauth_code_verifier', codeVerifier, cookieOptions)

    const clientId = process.env.OAUTH_CLIENT_ID
    const redirectUri = process.env.OAUTH_REDIRECT_URI
    const authorizeUrl = process.env.OAUTH_AUTHORIZE_URL
    const scope = process.env.OAUTH_SCOPE || '' // Default to empty scope if not set

    if (!clientId || !redirectUri || !authorizeUrl) {
      console.error('Missing OAuth environment variables (OAUTH_CLIENT_ID, OAUTH_REDIRECT_URI, OAUTH_AUTHORIZE_URL)')
      return NextResponse.json({ error: 'Server configuration error.' }, { status: 500 })
    }

    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope,
      state,
      code_challenge: codeChallenge,
      code_challenge_method: 'S256',
      prompt: 'login'
      // prompt: '', // Add if needed: "none", "consent", or "login"
    })

    const fullAuthorizeUrl = `${authorizeUrl}?${params.toString()}`

    return NextResponse.redirect(fullAuthorizeUrl)
  } catch (error) {
    console.error('Error during OAuth redirect:', error)
    // Return a generic error response to the client
    return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 })
  }
} 