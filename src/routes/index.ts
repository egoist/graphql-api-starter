import { Express } from 'express'
import connect from './connect'

export default (app: Express) => {
  connect(app)
}
