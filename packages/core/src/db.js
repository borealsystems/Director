import log from './utils/log'
import { MongoClient } from 'mongodb'

const client = new MongoClient('mongodb://127.0.0.1:27017?retryWrites=true&w=majority', { useUnifiedTopology: true })

let core
let devices
let stacks
let panels
let controllers

const initDB = async () => {
  log('info', 'core/lib/db', 'Loading Database')
  await client.connect()
  const database = client.db('DirectorCore')

  core = database.collection('core')
  devices = database.collection('devices')
  stacks = database.collection('stacks')
  panels = database.collection('panels')
  controllers = database.collection('controllers')
}

export { core, devices, stacks, panels, controllers, initDB }
