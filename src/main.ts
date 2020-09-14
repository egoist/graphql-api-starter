import '../scripts/load-env'
import express from 'express'
import { ApolloServer } from 'apollo-server-express'
import { buildSchema } from 'type-graphql'
import bodyParser from 'body-parser'
import addRoutes from './routes'
import { CurrentUserResolver } from './resolvers/current-user.resolver'

async function main() {
  const app = express()

  app.use(bodyParser.urlencoded({ extended: false }))
  app.use(bodyParser.json())

  addRoutes(app)

  const schema = await buildSchema({
    resolvers: [CurrentUserResolver],
  })

  const apolloServer = new ApolloServer({
    schema,
    tracing: process.env.NODE_ENV === 'development',
    introspection: true,
    playground: true,
    context({ req }) {
      return {
        request: req,
      }
    },
  })
  apolloServer.applyMiddleware({ app, path: '/graphql' })

  const { PORT } = process.env
  app.listen(PORT, (err) => {
    if (err) {
      console.error(err)
      process.exit(1)
    }
    console.log(`Server listening on http://localhost:${PORT}`)
  })
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
