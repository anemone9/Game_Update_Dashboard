const SESSION_COOKIE_NAME = 'admin_session'
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7

type SessionPayload = {
  username: string
  exp: number
}

function getAuthSecret() {
  const secret = process.env.AUTH_SECRET

  if (!secret) {
    throw new Error('AUTH_SECRET is not configured')
  }

  return secret
}

function getAdminCredentials() {
  const username = process.env.ADMIN_USERNAME
  const password = process.env.ADMIN_PASSWORD

  if (!username || !password) {
    throw new Error('ADMIN_USERNAME or ADMIN_PASSWORD is not configured')
  }

  return { username, password }
}

function bytesToBase64Url(bytes: Uint8Array) {
  let binary = ''

  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte)
  })

  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '')
}

function base64UrlToBytes(value: string) {
  const padded = value.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(value.length / 4) * 4, '=')
  const binary = atob(padded)
  const bytes = new Uint8Array(binary.length)

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index)
  }

  return bytes
}

function encodeBase64Url(value: string) {
  return bytesToBase64Url(new TextEncoder().encode(value))
}

function decodeBase64Url(value: string) {
  return new TextDecoder().decode(base64UrlToBytes(value))
}

async function sign(value: string) {
  const secret = getAuthSecret()
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )
  const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(value))
  return bytesToBase64Url(new Uint8Array(signature))
}

export async function createSessionToken(username: string) {
  const payload: SessionPayload = {
    username,
    exp: Date.now() + SESSION_TTL_MS,
  }
  const encodedPayload = encodeBase64Url(JSON.stringify(payload))
  const signature = await sign(encodedPayload)
  return `${encodedPayload}.${signature}`
}

export async function verifySessionToken(token?: string | null) {
  if (!token) {
    return null
  }

  const [encodedPayload, receivedSignature] = token.split('.')

  if (!encodedPayload || !receivedSignature) {
    return null
  }

  const expectedSignature = await sign(encodedPayload)

  if (expectedSignature !== receivedSignature) {
    return null
  }

  try {
    const payload = JSON.parse(decodeBase64Url(encodedPayload)) as SessionPayload

    if (payload.exp <= Date.now()) {
      return null
    }

    return payload
  } catch {
    return null
  }
}

export function getSessionCookieName() {
  return SESSION_COOKIE_NAME
}

export function getSessionMaxAge() {
  return Math.floor(SESSION_TTL_MS / 1000)
}

export function isValidAdminLogin(username: string, password: string) {
  const credentials = getAdminCredentials()
  return username === credentials.username && password === credentials.password
}
