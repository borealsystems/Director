import { initDevices } from './devices'
import { initProviders, cleanupProviders } from './providers'
import { initApollo } from './network/apollo'
import { initBridges } from './bridges'
import { initDB } from './db'
import log from './utils/log'
import fs from 'fs'

require('dotenv').config()

initApollo()
initBridges()
initDB()
  .then(() => initProviders())
  .then(() => initDevices())
  .catch(e => log('error', 'core', e)
  )

process.on('SIGINT', () => {
  fs.appendFileSync('logs.txt', '========= TERMINATING =========\r\n')
  cleanupProviders()
  setTimeout(process.exit(), 5000)
})

process.on('SIGHUP', () => {
  fs.appendFileSync('logs.txt', '========= TERMINATING =========\r\n')
  cleanupProviders()
  setTimeout(process.exit(), 5000)
})
