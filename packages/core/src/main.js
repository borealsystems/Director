import { initDevices, cleanupDevices } from './devices'
import { initProviders } from './providers'
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
  cleanupDevices()
    .then(() => log('warn', 'core', '========= TERMINATING ========='))
    .then(() => process.exit())
})

process.on('SIGHUP', () => {
  fs.appendFileSync('logs.txt', '========= TERMINATING =========\r\n')
  cleanupDevices()
    .then(() => log('warn', 'core', '========= TERMINATING ========='))
    .then(() => process.exit())
})
