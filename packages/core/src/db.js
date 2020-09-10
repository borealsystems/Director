import log from './utils/log'
import { MongoClient } from 'mongodb'

const client = new MongoClient(`mongodb://${process.env.DIRECTOR_CORE_DB_USERNAME}:${process.env.DIRECTOR_CORE_DB_PASSWORD}@${process.env.DIRECTOR_CORE_DB_HOST}:27017?retryWrites=true&w=majority`, { useUnifiedTopology: true })

let core
let devices
let stacks
let panels
let controllers

const initDB = async () => {
  log('info', 'core/lib/db', 'Loading Database')
  await client.connect()
  const database = client.db(process.env.DIRECTOR_CORE_DB_DATABASE)

  core = database.collection('core')
  devices = database.collection('devices')
  stacks = database.collection('stacks')
  panels = database.collection('panels')
  controllers = database.collection('controllers')
}

export { core, devices, stacks, panels, controllers, initDB }
