import { cores, devices, initDB } from './db'
import log from './utils/log'
import STATUS from './utils/statusEnum'
require('dotenv').config()

initDB()
  .then(() => {
    return cores.insertOne(
      {
        id: process.env.DIRECTOR_CORE_ID,
        label: process.env.DIRECTOR_CORE_LABEL,
        systemNotes: 'Welcome to Director!\n\nAdministrators can edit this note via the Core Configuration page.\n\nYou should probably include some useful notes here, like who manages and administers this system, and a link to your internal helpdesk or ticketing system for users having problems.',
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        realms: [
          {
            id: 'root',
            label: 'Default',
            description: `The Default Realm on ${process.env.DIRECTOR_CORE_LABEL}`
          }
        ]
      }
    )
  })
  .then(() => {
    return devices.insertOne(
      {
        core: process.env.DIRECTOR_CORE_ID,
        realm: 'root',
        id: '0',
        label: 'BorealSystems Director',
        location: 'The Void',
        provider: { id: 'BorealSystems-DirectorInternal', label: 'BorealDirector' },
        enabled: true,
        status: STATUS.UNKNOWN,
        description: 'The Director Core'
      }
    )
  })
  .then(() => {
    log('info', 'core/init', 'Initialised Database')
  })
  .catch(e => {
    log('error', 'core/init', e)
  })
  .finally(() => { process.exit() })