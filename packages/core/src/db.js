import log from './utils/log'
import { MongoClient } from 'mongodb'
require('dotenv').config()

const client = new MongoClient(`mongodb://${process.env.DIRECTOR_CORE_DB_USERNAME}:${process.env.DIRECTOR_CORE_DB_PASSWORD}@${process.env.DIRECTOR_CORE_DB_HOST}:27017?retryWrites=true&w=majority`, { useUnifiedTopology: true })

let cores
let controllers
let devices
let panels
let realms
let stacks
let tags

const initDB = async () => {
  log('info', 'core/lib/db', 'Loading Database')
  await client.connect()
  const database = client.db(process.env.DIRECTOR_CORE_DB_DATABASE)

  cores = database.collection('cores')
  controllers = database.collection('controllers')
  devices = database.collection('devices')
  panels = database.collection('panels')
  realms = database.collection('realms')
  stacks = database.collection('stacks')
  tags = database.collection('tags')
}

export { cores, realms, devices, stacks, panels, controllers, tags, initDB }
