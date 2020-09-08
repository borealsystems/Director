import { devices } from '../db'
import log from '../utils/log'
import shortid from 'shortid'
import { providers } from '../providers'
import STATUS from '../utils/statusEnum'

const deviceInstance = {}

const initDevices = () => {
  return new Promise((resolve, reject) => {
    log('info', 'core/lib/devices', 'Loading Devices')
    devices.updateOne(
      { id: '0' },
      {
        $set: {
          core: process.env.DIRECTOR_CORE_CONFIG_LABEL,
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
      .then(() => {
        devices.find({ core: process.env.DIRECTOR_CORE_CONFIG_LABEL }).forEach(device => {
          instantiateDevice(device.id)
        })
      })
  })
}

const cleanupDevices = () => {
  Object.keys(deviceInstance).forEach(deviceInstance => deviceInstance.destroy())
}

const updateDevice = (_device) => {
  let id
  return new Promise((resolve, reject) => {
    id = _device.id ? _device.id : shortid.generate()
    devices.updateOne(
      { id: id },
      {
        $set: {
          core: _device.core ? _device.core : process.env.DIRECTOR_CORE_CONFIG_LABEL,
          realm: _device.realm ? _device.realm : 'root',
          id: id,
          ..._device
        }
      },
      { upsert: true }
    )
      .then(() => {
        return devices.findOne({ id: id })
      })
      .then(device => {
        instantiateDevice(device.id)
        log('info', 'core/lib/devices', `Updated ${device.id} (${device.label})`)
        resolve(device)
      })
      .catch(e => reject(e))
  })
}

const instantiateDevice = (_id) => {
  devices.findOne({ id: _id }).then(device => {
    const provider = providers.find((provider) => provider.id === device.provider.id)
    if (deviceInstance[_id]) {
      deviceInstance[_id].destroy()
      deviceInstance[_id].init()
    } else {
      deviceInstance[_id] = new provider.Construct(device)
      deviceInstance[_id].init()
    }
    log('info', 'core/lib/devices', `Instantiated ${_id} (${device.label}) with ${device.provider.label}`)
  })
}

const deleteDevice = (_id) => {
  if (_id === '0') {
    log('info', 'core/lib/devices', 'You Can\'t Delete Director from Director')
    return 'error'
  } else {
    deviceInstance[_id].destroy()
    devices.deleteOne({ id: _id })
    log('info', 'core/lib/devices', `Deleted Device ${_id}`)
    return STATUS.OK
  }
}

export { instantiateDevice, updateDevice, deleteDevice, deviceInstance, initDevices, cleanupDevices }
