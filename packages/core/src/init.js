import { cores, devices, initDB } from './db'
import log from './utils/log'
import STATUS from './utils/statusEnum'
require('dotenv').config()

initDB()
  .then(() => {
    devices.updateOne(
      { id: '0' },
      {
        $set: {
          core: process.env.DIRECTOR_CORE_ID,
          realm: 'root',
          label: 'BorealSystems Director',
          location: 'The Void',
          provider: { id: 'BorealSystems-DirectorInternal', label: 'BorealDirector' },
          enabled: true,
          status: STATUS.UNKNOWN,
          description: 'The Director Core'
        }
      },
      { upsert: true }
    )
  })
  .then(() => {
    cores.updateOne(
      { id: process.env.DIRECTOR_CORE_ID },
      {
        $set: {
          id: process.env.DIRECTOR_CORE_ID,
          label: process.env.DIRECTOR_CORE_LABEL,
          realms: [
            {
              id: 'root',
              label: 'Default',
              description: `The Default Realm on ${process.env.DIRECTOR_CORE_LABEL}`
            }
          ]
        }
      },
      { upsert: true }
    )
  })
  .then(() => {
    log('info', 'core/init', 'Initialised Database')
  })
  .catch(e => {
    log('error', 'core/init', e)
  })
  .finally(() => { process.exit() })
