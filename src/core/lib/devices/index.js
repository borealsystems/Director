import db from '../db'
import log from '../log'

const devices = []

const initDevices = () => {
  db.get('devices').then((d) => {
    if (d === undefined) {
      devices.push({
        name: 'Boreal Systems Director',
        id: '0',
        provider: 'internal',
        enabled: true,
        status: 'Good',
        description: 'The Director Core'
      })
    } else {
      d.map((item, index) => {
        devices.push(item)
      })
    }
  })
}

const createNewDevice = (newDevice) => {
  devices.push(newDevice)
  db.set('devices', devices)
  log('info', 'core/lib/devices', `Creating ${newDevice.id} (${newDevice.name})`)
}

export { createNewDevice, devices, initDevices }
