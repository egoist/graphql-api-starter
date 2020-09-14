/**
 * Run a command with `.env` loaded
 */

const spawn = require('cross-spawn')
require('./load-env')

const args = process.argv.slice(2)

spawn.sync(args[0], args.slice(1), {
  stdio: 'inherit',
  env: process.env,
})
