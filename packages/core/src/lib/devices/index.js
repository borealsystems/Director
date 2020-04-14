import db from '../db'
import log from '../log'
import { remove } from 'lodash'

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

const deleteDevice = (_id) => {
  // const removedDevice = devices.find((item) => { return item.id === _id })
  if (_id === '0') {
    log('info', 'core/lib/devices', 'You Can\'t Delete BorealDirector from BorealDirector')
    return 'error'
  } else {
    const removedDevice = remove(devices, (item) => {
      return item.id === _id
    })
    if (!devices.find((item) => { return item.id === _id })) {
      log('info', 'core/lib/devices', `Deleted ${_id} (${removedDevice[0].name})`)
      db.set('devices', devices)
      return 'ok'
    } else {
      log('info', 'core/lib/devices', `Deletion of ${_id} (${removedDevice[0].name}) failed.`)
      return 'error'
    }
  }
}
export { instantiateDeviceProvider, createNewDevice, deleteDevice, devices, initDevices }
