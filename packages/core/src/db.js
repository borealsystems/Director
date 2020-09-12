import log from './utils/log'
import { MongoClient } from 'mongodb'
require('dotenv').config()

const client = new MongoClient(`mongodb://${process.env.DIRECTOR_CORE_DB_USERNAME}:${process.env.DIRECTOR_CORE_DB_PASSWORD}@${process.env.DIRECTOR_CORE_DB_HOST}:27017?retryWrites=true&w=majority`, { useUnifiedTopology: true })

let cores
let realms
let devices
let stacks
let panels
let controllers

const initDB = async () => {
  log('info', 'core/lib/db', 'Loading Database')
  await client.connect()
  const database = client.db(process.env.DIRECTOR_CORE_DB_DATABASE)

  cores = database.collection('cores')
  realms = database.collection('realms')
  devices = database.collection('devices')
  stacks = database.collection('stacks')
  panels = database.collection('panels')
  controllers = database.collection('controllers')
}

export { cores, realms, devices, stacks, panels, controllers, initDB }
