import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'
import { locales } from './i18n'

// Function to detect locale from request headers and user preferences
function detectLocale(request: NextRequest): string {
  // Check if there's a cookie for user's preferred locale
  const localeCookie = request.cookies.get('locale')?.value
  if (localeCookie && locales.includes(localeCookie as any)) {
    return localeCookie
  }

  // Fall back to Accept-Language header
  const acceptLanguage = request.headers.get('Accept-Language')
  if (acceptLanguage) {
    // Simple language detection from Accept-Language header
    const languages = acceptLanguage.split(',').map(lang => lang.split(';')[0].trim().toLowerCase())

    for (const lang of languages) {
      if (lang === 'nb' || lang === 'no') return 'no' // Norwegian
      if (lang === 'sv') return 'sv' // Swedish
      if (lang === 'da') return 'da' // Danish
      if (lang === 'th') return 'th' // Thai
      if (lang === 'en') return 'en' // English
    }
  }

  return 'en' // Default to English
}

// Define public routes that don't require authentication
const publicRoutes = [
  '/login',
  '/register',
  '/forgot-password',
  '/',
  '/about',
  '/contact',
  '/site',
  '/pricing',
  '/privacy',
  '/terms',
  '/faq',
]

// Define the JWT secret (should match backend)
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'ThisIsAVerySecretKeyForJWTTokenGenerationPleaseChangeInProduction2024!'
)

interface JwtPayload {
  exp?: number
  sub?: string
  email?: string
}

function isTokenExpiringSoon(exp: number | undefined): boolean {
  if (!exp) return true

  const currentTime = Math.floor(Date.now() / 1000)
  const timeUntilExpiry = exp - currentTime

  // Consider token expiring soon if less than 5 minutes remaining
  return timeUntilExpiry < 300
}

async function refreshToken(request: NextRequest): Promise<NextResponse | null> {
  const refreshTokenCookie = request.cookies.get('RefreshToken')

  if (!refreshTokenCookie) {
    return null
  }

  try {
    // Call the refresh endpoint
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5158'}/api/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: `RefreshToken=${refreshTokenCookie.value}`,
      },
      body: JSON.stringify({ clientType: 'Web' }),
    })

    if (response.ok) {
      // Get the new cookies from the response
      const setCookieHeader = response.headers.get('set-cookie')
      if (setCookieHeader) {
        // Create a new response and set the cookies
        const nextResponse = NextResponse.next()

        // Parse and set cookies from the backend response
        const cookies = setCookieHeader.split(',').map(c => c.trim())
        cookies.forEach(cookie => {
          const [nameValue, ...attributes] = cookie.split(';')
          const [name, value] = nameValue.split('=')

          if (name === 'AccessToken' || name === 'RefreshToken') {
            nextResponse.cookies.set({
              name: name.trim(),
              value: value.trim(),
              httpOnly: true,
              secure: true,
              sameSite: 'none',
              path: '/',
            })
          }
        })

        return nextResponse
      }
    }
  } catch (error) {
    console.error('Error refreshing token:', error)
  }

  return null
}

export async function middleware(request: NextRequest) {
  const url = request.nextUrl.clone()
  const hostname = request.headers.get('host') || ''
  const pathname = request.nextUrl.pathname

  // First, handle subdomain routing for live websites
  const subdomainMatch = hostname.match(/^([^.]+)\.(kumiko\.no|localhost)(:\d+)?$/)

  if (subdomainMatch) {
    const subdomain = subdomainMatch[1]

    // Skip if it's the main domain or app subdomain
    if (subdomain !== 'www' && subdomain !== 'app') {
      // Rewrite to the live website page (public route, no auth needed)
      const originalPath = url.pathname
      let newPath: string

      if (originalPath === '/') {
        // Homepage: subdomain.localhost -> /site/subdomain
        newPath = `/site/${subdomain}`
      } else {
        // Page with slug: subdomain.localhost/about -> /site/subdomain/about
        newPath = `/site/${subdomain}${originalPath}`
      }

      url.pathname = newPath
      // Return the rewrite without running auth checks
      return NextResponse.rewrite(url)
    }
  }

  // Detect and set locale for non-subdomain routes
  const locale = detectLocale(request)

  // Create response that will continue through the middleware
  const response = NextResponse.next()

  // Set the detected locale in a custom header for the app to use
  response.headers.set('x-locale', locale)

  // Check if the current route is public
  const isPublicRoute = publicRoutes.some(route => pathname === route || pathname.startsWith(`${route}/`))

  if (isPublicRoute) {
    return response
  }

  // Get the access token from cookies
  const accessToken = request.cookies.get('AccessToken')

  if (!accessToken) {
    // No access token, try to refresh
    const refreshResponse = await refreshToken(request)
    if (refreshResponse) {
      return refreshResponse
    }

    // Redirect to login if no token and refresh failed
    return NextResponse.redirect(new URL('/login', request.url))
  }

  try {
    // Verify the token using jose
    const { payload } = await jwtVerify(accessToken.value, JWT_SECRET, {
      issuer: 'BackendApi',
      audience: 'BackendApiClients',
    })

    const jwtPayload = payload as unknown as JwtPayload

    // Check if token is about to expire
    if (isTokenExpiringSoon(jwtPayload.exp)) {
      // Try to refresh the token
      const refreshResponse = await refreshToken(request)
      if (refreshResponse) {
        return refreshResponse
      }
    }

    // Token is valid, continue with locale header
    return response
  } catch (error) {
    // Token is invalid, try to refresh
    const refreshResponse = await refreshToken(request)
    if (refreshResponse) {
      return refreshResponse
    }

    // Redirect to login if token is invalid and refresh failed
    return NextResponse.redirect(new URL('/login', request.url))
  }
}

// Configure which routes the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - icons (static images)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|icons|public).*)',
  ],
}
