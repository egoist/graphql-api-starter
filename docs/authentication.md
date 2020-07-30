# Authentication

Authentication is based on Social Auth and JWT.

## Configure OAuth

General config:

```bash
# You only need to change this in production
# e.g. https://api.my-app.com
OAUTH_CALLBACK_URL=xxx

# You only need to change this in production
# We redirect success login to this URL with jwt token as URL hash `#token=xxx`
# e.g. https://my-app.com/dashboard
OAUTH_REDIRECT_URL=xxx
```

### Enable Google Auth

Get your credentials in [Google API console](https://console.developers.google.com/), and update env variables:

```bash
GOOGLE_CLIENT_ID=xxx
GOOGLE_CLIENT_SECRET=xxx
```

### Enable GitHub Auth

[Create an OAuth app](https://github.com/settings/applications/new), and update env variables:

```bash
GITHUB_CLIENT_ID=xxx
GITHUB_CLIENT_SECRET=xxx
```

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
