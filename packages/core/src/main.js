import './lib/network/express'

import { initDevices } from './lib/devices'
import { initProviders } from './lib/providers'
import db from './lib/db'

initDevices()
initProviders()

db.set('status', ['success', 'All Systems Go', 'Director, and everything it controls, are operating as intended and are not reporting any errors.'])
