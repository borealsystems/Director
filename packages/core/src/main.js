import { initControllers } from './controllers'
import { initDevices } from './devices'
import { initProviders, cleanupProviders } from './providers'
import { initStacks } from './stacks'
import { initPanels } from './panels'
import { initExpress, cleanupExpress } from './network/express'
import { initBridges } from './bridges'
import { core } from './db'

import fs from 'fs'
import os from 'os'

initExpress()
initBridges()
initProviders()
  .then(() => initDevices())
  .then(() => initStacks())
  .then(() => initPanels())
  .then(() => initControllers())

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

core.put('status', ['success', 'All Systems Go', 'Director is operating as intended and are not reporting any errors.'])
core.put('config', { port: 4000, label: os.hostname(), mdns: true })
