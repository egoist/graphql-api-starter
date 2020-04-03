import { Request } from 'express'
import { AuthenticationError } from 'apollo-server-express'
import { verifyToken } from './jwt'

export async function requireAuth(request: Request) {
  const token =
    request.headers.authorization &&
    request.headers.authorization.replace(/^bearer\s+/i, '')

  if (!token) {
    throw new AuthenticationError(`Missing token`)
  }

  try {
    const payload = verifyToken(token)
    return payload
  } catch (error) {
    throw new AuthenticationError(error.message)
  }
}
