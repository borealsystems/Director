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

core.put('status', ['success', 'All Systems Go', 'Director is operating as intended and is not reporting any errors.'])
core.put('config', {
  port: 4000,
  label: os.hostname(),
  systemNotes: 'Welcome to Director!\n\nAdministrators can edit this note via the Core Configuration page.\n\nYou should probably include some useful notes here, like who manages and administers this system, and a link to your internal helpdesk or ticketing system for users having problems.'
})
