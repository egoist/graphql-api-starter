import {
  Resolver,
  Mutation,
  Args,
  ArgsType,
  Field,
  ObjectType,
} from 'type-graphql'
import { hash, compare } from 'bcryptjs'
import { getUserRepo } from '../database/connection'
import { generateToken } from '../lib/jwt'
import { stripe, stripeEnabled } from '../lib/stripe'
import { ApolloError } from 'apollo-server-express'

@ArgsType()
class SignupArgs {
  @Field()
  name: string

  @Field()
  email: string

  @Field()
  password: string
}

@ArgsType()
class LoginArgs {
  @Field()
  email: string

  @Field()
  password: string
}

@ObjectType()
class AuthPayload {
  @Field()
  token: string
}

@Resolver()
export default class AuthResolver {
  @Mutation(returns => AuthPayload)
  async signup(@Args() args: SignupArgs): Promise<AuthPayload> {
    const userRepo = await getUserRepo()

    const existing = await userRepo.findOne({
      where: {
        email: args.email,
      },
      select: ['id'],
    })

    if (existing) {
      throw new ApolloError(`Email is already used`)
    }

    const user = userRepo.create({
      name: args.name,
      email: args.email,
      passwordHash: await hash(args.password, 8),
    })
    if (stripeEnabled) {
      const customer = await stripe.customers.create({
        name: args.name,
        description: `Name: ${args.name}`,
        email: args.email,
      })
      user.customerId = customer.id
    }

    await userRepo.save(user)
    const token = generateToken(user.id)
    return {
      token,
    }
  }

  @Mutation(returns => AuthPayload)
  async login(@Args() args: LoginArgs): Promise<AuthPayload> {
    const userRepo = await getUserRepo()
    const user = await userRepo.findOne({
      where: {
        email: args.email,
      },
      select: ['id', 'passwordHash'],
    })
    if (!user) {
      throw new ApolloError(`User not found`)
    }

    const passwordMatches =
      user.passwordHash && (await compare(args.password, user.passwordHash))

    if (!passwordMatches) {
      throw new ApolloError(`Invalid password`)
    }

    const token = generateToken(user.id)
    return {
      token,
    }
  }

  @Mutation(returns => Boolean)
  resetPassword() {
    throw new Error(`Not implemented yet`)
  }
}
