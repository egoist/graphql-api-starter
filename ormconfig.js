require('dotenv/config')

module.exports = [
  {
    name: 'default',
    type: 'postgres',
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 5432,
    username: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASS,
    logging: process.env.NODE_ENV === 'development',
    entities: ['dist/**/*.entity.js'],
    // indicates that typeorm must load migrations from the given "migration" directory.
    migrations: ['dist/migrations/*.js'],
    cli: {
      // indicates that the CLI must create new migrations in the "migration" directory.
      migrationsDir: 'src/migrations',
    },
  },
]