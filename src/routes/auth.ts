import { Express, Request, Response } from 'express'
import passport, { Profile } from 'passport'
import {
  OAuth2Strategy as GoogleStrategy,
  VerifyFunction,
} from 'passport-google-oauth'
import { Strategy as GithubStrategy } from 'passport-github'
import { nanoid } from 'nanoid'
import { getUserRepo } from '../database/connection'
import { generateToken } from '../lib/jwt'

const enableGoogleAuth =
  process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
const enableGithubAuth =
  process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET

const verifyAuth = async (
  accessToken: string,
  refreshToken: string,
  profile: Profile,
  done: VerifyFunction,
) => {
  const userRepo = await getUserRepo()
  const email = profile.emails && profile.emails[0]
  if (!email) {
    return done(new Error(`Expect user to have a valid email address`))
  }
  const existing = await userRepo.findOne({
    where: {
      email: email.value,
    },
  })
  if (existing) {
    return done(null, existing)
  }
  const user = userRepo.create()
  user.id = nanoid()
  user.provider = profile.provider
  user.providerId = profile.id
  user.name = profile.displayName
  user.email = email.value
  await userRepo.save(user)
  done(null, user)
}

const getOauthCallbackURL = (provider: 'google' | 'github') => {
  return `${process.env.OAUTH_CALLBACK_URL}/auth/${provider}/callback`
}

if (enableGoogleAuth) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        callbackURL: getOauthCallbackURL('google'),
      },
      verifyAuth,
    ),
  )
}

if (enableGithubAuth) {
  passport.use(
    new GithubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID!,
        clientSecret: process.env.GITHUB_CLIENT_SECRET!,
        callbackURL: getOauthCallbackURL('github'),
      },
      verifyAuth,
    ),
  )
}

function generateUserToken(req: Request, res: Response) {
  const token = generateToken((req.user as any).id)
  res.redirect(`${process.env.OAUTH_REDIRECT_URL}#token=${token}`)
}

export default (server: Express) => {
  if (enableGoogleAuth) {
    server.get(
      '/auth/google',
      passport.authenticate('google', {
        session: false,
        scope: ['openid', 'profile', 'email'],
      }),
    )
    server.get(
      '/auth/google/callback',
      passport.authenticate('google', { session: false }),
      generateUserToken,
    )
  }
  if (enableGithubAuth) {
    server.get(
      '/auth/github',
      passport.authenticate('github', {
        session: false,
        scope: ['user:email'],
      }),
    )
    server.get(
      '/auth/github/callback',
      passport.authenticate('github', { session: false }),
      generateUserToken,
    )
  }
}
