# Authentication

Authentication is based on JWT.

## Check if current user is authed in a resolver

```ts
import { GqlContext, Context } from 'src/decorators/gql-context'
import { requireAuth } from 'src/lib/require-auth'

@Query(returns => SomeThing)
async someQuery(@GqlContext() ctx: Context) {
  const { userId } = await requireAuth(ctx.request)
}
```

## Email verification

[TODO]

## Social login

[TODO]