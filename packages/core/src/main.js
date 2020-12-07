import { initDevices, cleanupDevices } from './devices'
import { initProviders } from './providers'
import { initApollo } from './network/apollo'
import { initBridges } from './bridges'
import { initDB, cores, devices } from './db'
import STATUS from './utils/statusEnum'
import log from './utils/log'
import fs from 'fs'

require('dotenv').config()

initApollo()
initBridges()
initDB()
  .then(() => {
    cores.countDocuments({}, (err, count) => {
      if (err) log('error', 'core', err)
      if (count === 0) {
        log('info', 'core', 'Initialising Database')
        cores.insertOne(
          {
            id: process.env.DIRECTOR_CORE_ID,
            label: process.env.DIRECTOR_CORE_LABEL,
            helpdeskVisable: false,
            realms: [
              {
                id: 'ROOT',
                label: 'Root',
                description: `The Root Realm on ${process.env.DIRECTOR_CORE_LABEL}`,
                notes: 'Welcome to Director!\n\nAdministrators can edit this note via the Realm Configuration page.\n\nYou should probably include some useful notes here, like who manages and administers this system, and a link to your internal helpdesk or ticketing system for users having problems.'
              }
            ]
          }
        )
        devices.insertOne(
          {
            core: process.env.DIRECTOR_CORE_ID,
            realm: 'ROOT',
            id: `CORE-${process.env.DIRECTOR_CORE_ID}`,
            label: process.env.DIRECTOR_CORE_LABEL,
            location: 'The Void',
            provider: { id: 'ProtocolProviderBorealDirector', label: 'BorealDirector' },
            enabled: true,
            status: STATUS.UNKNOWN,
            description: `The virtual device for Core ${process.env.DIRECTOR_CORE_ID}`
          }
        )
      }
    })
  })
  .then(() => initProviders())
  .then(() => initDevices())
  .catch(e => log('error', 'core', e))

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
