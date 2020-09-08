import { initControllers } from './controllers'
import { initDevices } from './devices'
import { initProviders, cleanupProviders } from './providers'
import { initStacks } from './stacks'
import { initPanels } from './panels'
import { initExpress, cleanupExpress } from './network/express'
import { initBridges } from './bridges'
import { initDB } from './db'
import log from './utils/log'

import fs from 'fs'

initExpress()
initBridges()
initDB()
  .then(() => initProviders())
  .then(() => initDevices())
  .then(() => initStacks())
  .then(() => initPanels())
  .then(() => initControllers())
  .catch(e => log('error', 'core', e)
  )

process.on('SIGINT', () => {
  fs.appendFileSync('logs.txt', '========= TERMINATING =========\r\n')
  cleanupProviders()
  cleanupExpress()
  setTimeout(process.exit(), 5000)
})

process.on('SIGHUP', () => {
  fs.appendFileSync('logs.txt', '========= TERMINATING =========\r\n')
  cleanupProviders()
  cleanupExpress()
  setTimeout(process.exit(), 5000)
})
