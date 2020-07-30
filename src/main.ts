import '../scripts/load-env'
import { join } from 'path'
import express from 'express'
import { ApolloServer } from 'apollo-server-express'
import { buildSchema } from 'type-graphql'
import helmet from 'helmet'
import bodyParser from 'body-parser'
import { getConnection } from './database/connection'

async function main() {
  const server = express()

  server.use(
    helmet({
      frameguard: false,
    }),
  )

  server.use(bodyParser.urlencoded({ extended: false }))
  server.use(bodyParser.json())

  server.get('/', (req, res) => {
    res.send({
      date: new Date(),
    })
  })

  const schema = await buildSchema({
    resolvers: [join(__dirname, 'resolvers/*.resolver.js')],
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
  apolloServer.applyMiddleware({ app: server, path: '/graphql' })

  const { PORT } = process.env
  server.listen(PORT, (err) => {
    if (err) {
      console.error(err)
      process.exit(1)
    }
    console.log(`Server listening on http://localhost:${PORT}`)
  })

  if (process.env.NODE_ENV === 'production') {
    const connection = await getConnection()
    await connection.runMigrations({
      transaction: 'all',
    })
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
