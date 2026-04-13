import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getSessionCookieName, verifySessionToken } from '@/lib/auth'

function isProtectedPath(pathname: string) {
  if (pathname.startsWith('/admin')) {
    return true
  }

  if (pathname.startsWith('/api/games') || pathname.startsWith('/api/updates')) {
    return true
  }

  return false
}

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl

  if (!isProtectedPath(pathname)) {
    return NextResponse.next()
  }

  const token = request.cookies.get(getSessionCookieName())?.value
  const session = await verifySessionToken(token)

  if (session) {
    return NextResponse.next()
  }

  const loginUrl = new URL('/login', request.url)
  loginUrl.searchParams.set('next', `${pathname}${search}`)
  return NextResponse.redirect(loginUrl)
}

export const config = {
  matcher: ['/admin/:path*', '/api/games/:path*', '/api/updates/:path*'],
}
