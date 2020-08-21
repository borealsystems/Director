import { initControllers } from './controllers'
import { initDevices } from './devices'
import { initProviders, cleanupProviders } from './providers'
import { initStacks } from './stacks'
import { initPanels } from './panels'
import { initExpress, cleanupExpress } from './network/express'
import { initMDNS } from './network/mdns'
import { initBridges } from './bridges'

import db from './db'

initExpress()
initMDNS()
initBridges()
initProviders()
  .then(() => initDevices())
  .then(() => initStacks())
  .then(() => initPanels())
  .then(() => initControllers())

process.on('SIGINT', () => {
  cleanupProviders()
  cleanupExpress()
  setTimeout(process.exit(), 5000)
})

process.on('SIGHUP', () => {
  cleanupProviders()
  cleanupExpress()
  setTimeout(process.exit(), 5000)
})

db.set('status', ['success', 'All Systems Go', 'Director, and everything it controls, are operating as intended and are not reporting any errors.'])
