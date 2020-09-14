import { Request } from 'express'
import { AuthenticationError } from 'apollo-server-express'
import Iron from '@hapi/iron'
import { parse } from 'cookie'
import { AUTH_COOKIE_NAME } from '@/lib/constants'
import { prisma } from '@/lib/prisma'

export async function requireAuth(request: Request) {
  const token = parse(request.headers.cookie || '')[AUTH_COOKIE_NAME]

  if (!token) {
    throw new AuthenticationError(`Missing token`)
  }

  try {
    const payload = await Iron.unseal(
      token,
      process.env.ENCRYPT_SECRET,
      Iron.defaults,
    )
    const user = await prisma.user.findOne({
      where: { id: payload.userId },
      include: {
        members: true,
      },
    })
    if (!user) {
      throw new AuthenticationError(`User not found`)
    }
    return user
  } catch (error) {
    throw new AuthenticationError(error.message)
  }
}
