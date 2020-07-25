import { initDevices } from './lib/devices'
import { initProviders, cleanupProviders } from './lib/providers'
import { initStacks } from './lib/stacks'
import { initPanels } from './lib/panels'
import { initExpress, cleanupExpress } from './lib/network/express'
import { initMDNS } from './lib/network/mdns'

import db from './lib/db'

initExpress()
initMDNS()
initProviders(() => initDevices(() => initStacks(() => initPanels())))

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
