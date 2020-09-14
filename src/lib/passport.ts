import { Request, Response } from 'express'
import passport, { Profile } from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import { Strategy as GitHubStrategy } from 'passport-github'
import { AUTH_COOKIE_NAME } from './constants'
import Iron from '@hapi/iron'
import { serialize } from 'cookie'
import { prisma } from '@/lib/prisma'

passport.serializeUser<any, string>((user, done) => {
  done(null, user.id)
})

passport.deserializeUser<any, string>((id, done) => {
  prisma.user
    .findOne({
      where: {
        id,
      },
    })
    .then((user) => {
      done(null, user)
    })
    .catch((error) => {
      console.log(`Error: ${error}`)
    })
})

const enableGoogle =
  process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
const enableGithub =
  process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET

if (enableGoogle) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        callbackURL: `/connect/google/callback`,
      },
      async (accessToken, refreshToken, profile, cb) => {
        const user = await getUserByProviderProfile(profile, 'google')
        cb(undefined, user)
      },
    ),
  )
}

if (enableGithub) {
  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID!,
        clientSecret: process.env.GITHUB_CLIENT_SECRET!,
        callbackURL: `${process.env.API_URL}/connect/github/callback`,
      },
      async (accessToken, refreshToken, profile, cb) => {
        try {
          const user = await getUserByProviderProfile(profile, 'github')
          cb(null, user)
        } catch (error) {
          cb(error)
        }
      },
    ),
  )
}

async function getUserByProviderProfile(
  profile: Profile,
  provider: 'github' | 'google',
) {
  const email = profile.emails && profile.emails[0].value
  const avatar = profile.photos && profile.photos[0].value

  if (!email) {
    throw new Error(`No email provided`)
  }

  const providerKey = `${provider}UserId` as 'githubUserId' | 'googleUserId'

  // Find one by provider user id
  let existing = await prisma.user.findOne({
    where: {
      [providerKey]: profile.id,
    },
  })
  // Otherwise find one with the same email and link them
  if (!existing) {
    existing = await prisma.user.findOne({
      where: {
        email,
      },
    })
    if (existing) {
      await prisma.user.update({
        where: {
          id: existing.id,
        },
        data: {
          [providerKey]: profile.id,
        },
      })
    }
  }

  if (!existing) {
    existing = await prisma.user.create({
      data: {
        email,
        name: profile.displayName || profile.username || '',
        [providerKey]: profile.id,
        avatar,
      },
    })
  }

  if (avatar && existing.avatar !== avatar) {
    await prisma.user.update({
      where: {
        id: existing.id,
      },
      data: {
        avatar,
      },
    })
  }

  return existing
}

export { passport }

export async function handleSuccessfulLogin(req: Request, res: Response) {
  const { id } = (req as $TsFixMe).user
  const authToken = await Iron.seal(
    {
      userId: id,
    },
    process.env.ENCRYPT_SECRET,
    Iron.defaults,
  )
  const authCookie = serialize(AUTH_COOKIE_NAME, authToken, {
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 60, // 2 months
  })
  res.setHeader('Set-Cookie', [authCookie])
  res.redirect(`${process.env.APP_URL}${process.env.REDIRECT_PATH}`)
}
