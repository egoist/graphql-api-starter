import { createConnection, Connection, getConnectionManager } from 'typeorm'
import { User } from './user.entity'

const CONNECTION_NAME = 'default'

export async function getConnection() {
  const connectionManager = getConnectionManager()

  if (connectionManager.has(CONNECTION_NAME)) {
    console.log(`Reuse connection`)
    let connection = connectionManager.get(CONNECTION_NAME)
    if (!connection.isConnected) {
      connection = await connection.connect()
    }
    return connection
  }

  const connection = await createConnection()
  return connection
}

export async function getUserRepo() {
  const connection = await getConnection()
  return connection.getRepository(User)
}