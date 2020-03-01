import './lib/network/express'
import './lib/network/providers'

import { initDevices } from './lib/devices'
import db from './lib/db'

initDevices()
db.set('status', ['success', 'All Systems Go', 'Director, and everything it controls, are operating as intended and are not reporting any errors.'])
