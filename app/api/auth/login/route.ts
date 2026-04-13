import { NextRequest, NextResponse } from 'next/server'
import {
  createSessionToken,
  getSessionCookieName,
  getSessionMaxAge,
  isValidAdminLogin,
} from '@/lib/auth'

export async function POST(request: NextRequest) {
  const { username, password } = await request.json()

  if (!isValidAdminLogin(username, password)) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
  }

  const token = await createSessionToken(username)
  const response = NextResponse.json({ ok: true })

  response.cookies.set({
    name: getSessionCookieName(),
    value: token,
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: getSessionMaxAge(),
  })

  return response
}
