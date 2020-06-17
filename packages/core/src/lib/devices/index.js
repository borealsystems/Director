import db from '../db'
import log from '../log'
import { findIndex, remove } from 'lodash'
import shortid from 'shortid'

// import deviceUpdateInputType from '../network/graphql/deviceTypes/deviceUpdateInputType'

const devices = []

const initDevices = () => {
  db.get('devices').then((d) => {
    if (d === undefined) {
      devices.push({
        label: 'Boreal Systems Director',
        id: '0',
        provider: 'internal',
        enabled: true,
        status: 'ok',
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

const updateDevice = (_device) => {
  switch (_device.id !== undefined) {
    case true: {
      devices[findIndex(devices, item => item.id === _device.id)] = { ...devices[devices.indexOf(item => item.id === _device.id)], ..._device }
      db.set('devices', devices)
      log('info', 'core/lib/devices', `Updating ${_device.id} (${_device.label})`)
      instantiateDeviceProvider(_device.id)
      return _device.id
    }
    case false: {
      const device = { id: shortid.generate(), ..._device }
      devices.push(device)
      db.set('devices', devices)
      log('info', 'core/lib/devices', `Creating ${device.id} (${device.label})`)
      instantiateDeviceProvider(device.id)
      return device.id
    }
  }
}

const instantiateDeviceProvider = (_id) => {
  const device = devices.find(({ id }) => id === _id)
  switch (device.provider) {
    case 'genericOSC':
      log('info', 'core/lib/devices', `Loaded ${device.id} (${device.label}) with ${device.provider}`)
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
      log('info', 'core/lib/devices', `Deleted ${_id} (${removedDevice[0].label})`)
      db.set('devices', devices)
      return 'ok'
    } else {
      log('info', 'core/lib/devices', `Deletion of ${_id} (${removedDevice[0].label}) failed.`)
      return 'error'
    }
  }
}
export { instantiateDeviceProvider, updateDevice, deleteDevice, devices, initDevices }
