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
        instantiateDeviceProvider(item.id)
      })
    }
  })
}

const createNewDevice = (newDevice) => {
  devices.push(newDevice)
  db.set('devices', devices)
  log('info', 'core/lib/devices', `Creating ${newDevice.id} (${newDevice.name})`)
  instantiateDeviceProvider(newDevice.id)
}

const instantiateDeviceProvider = (_id) => {
  const device = devices.find(({ id }) => id === _id)
  switch (device.provider) {
    case 'genericOSC':
      log('info', 'core/lib/devices', `Loaded ${device.id} (${device.name}) with ${device.provider}`)
      break
  }
}

export { instantiateDeviceProvider, createNewDevice, devices, initDevices }
