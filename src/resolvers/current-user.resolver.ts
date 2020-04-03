import {
  Resolver,
  Query,
  ObjectType,
  Field,
  ID,
  Mutation,
  ArgsType,
  Args,
} from 'type-graphql'
import { Context, GqlContext } from '../decorators/gql-context'
import { requireAuth } from '../lib/require-auth'
import { getUserRepo } from '../database/connection'

@ObjectType()
class CurrentUser {
  @Field(type => ID)
  id: string

  @Field()
  email: string

  @Field()
  name: string

  @Field({ nullable: true })
  customerId?: string
}

@ArgsType()
class UpdateProfileArgs {
  @Field()
  name: string

  @Field()
  email: string
}

@Resolver()
export class CurrentUserResolver {
  @Query(returns => CurrentUser)
  async currentUser(@GqlContext() context: Context) {
    const { userId } = await requireAuth(context.request)
    const userRepo = await getUserRepo()
    return userRepo.findOne(userId)
  }

  @Mutation(returns => CurrentUser)
  async updateProfile(
    @Args() args: UpdateProfileArgs,
    @GqlContext() ctx: Context
  ) {
    const { userId } = await requireAuth(ctx.request)
    const userRepo = await getUserRepo()
    const user = await userRepo.findOneOrFail(userId)
    Object.assign(user, args)
    await userRepo.save(user)
    return user
  }
}
