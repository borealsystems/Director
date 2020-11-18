import { devices } from '../db'
import log from '../utils/log'
import shortid from 'shortid'
import { providers } from '../providers'
import STATUS from '../utils/statusEnum'

const deviceInstance = {}

const initDevices = () => {
  return new Promise((resolve, reject) => {
    log('info', 'core/lib/devices', 'Loading Devices')
    devices.find({ core: process.env.DIRECTOR_CORE_ID }).forEach(device => {
      instantiateDevice(device.id)
    })
  })
}

const cleanupDevices = () => new Promise(resolve => {
  for (const [key, device] of Object.entries(deviceInstance)) {
    device.destroy()
    delete deviceInstance[key]
  }
  resolve()
})

const updateDevice = (_device) => {
  let id
  return new Promise((resolve, reject) => {
    id = _device.id ? _device.id : shortid.generate()
    devices.updateOne(
      { id: id },
      {
        $set: {
          core: _device.core ? _device.core : process.env.DIRECTOR_CORE_ID,
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
    if (device.enabled) {
      const provider = providers.find((provider) => provider.id === device.provider.id)
      const configuration = {}
      device.configuration && device.configuration.map(conf => { configuration[conf.id] = conf.value })
      if (deviceInstance[_id]) {
        deviceInstance[_id].destroy()
        deviceInstance[_id] = new provider.constructor({ ...device, configuration: configuration })
        deviceInstance[_id].init()
      } else {
        deviceInstance[_id] = new provider.constructor({ ...device, configuration: configuration })
        deviceInstance[_id].init()
      }
      log('info', 'core/lib/devices', `Loaded ${_id} (${device.label}) with ${device.provider.label}`)
    } else {
      log('info', 'core/lib/devices', `${_id} (${device.label}) is disabled, skipping initialisation`)
    }
  })
}

const deleteDevice = (_id) => {
  if (_id.match(/CORE-/)) {
    log('info', 'core/lib/devices', 'You Can\'t Delete Director from Director!')
    return 'error'
  } else {
    deviceInstance[_id].destroy()
    delete deviceInstance[_id]
    devices.deleteOne({ id: _id })
    log('info', 'core/lib/devices', `Deleted Device ${_id}`)
    return STATUS.OK
  }
}

const enableDevice = _id => new Promise((resolve, reject) => {
  log('info', 'core/lib/devices', `Enabling ${_id}`)
  if (_id.match(/CORE-/)) {
    log('info', 'core/lib/devices', 'You Can\'t Enable Director!')
    reject(new Error('Cannot Enable Director'))
  } else {
    devices.updateOne(
      { id: _id },
      {
        $set: {
          enabled: true
        }
      }
    ).then(() => {
      instantiateDevice(_id)
      resolve(STATUS.OK)
    })
  }
})

const disableDevice = _id => new Promise((resolve, reject) => {
  log('info', 'core/lib/devices', `Disabling ${_id}`)
  if (_id.match(/CORE-/)) {
    log('info', 'core/lib/devices', 'You Can\'t Disable Director!')
    reject(new Error('Cannot Disable Director'))
  } else {
    devices.updateOne(
      { id: _id },
      {
        $set: {
          enabled: false
        }
      }
    ).then(() => {
      deviceInstance[_id].destroy()
      delete deviceInstance[_id]
      resolve(STATUS.OK)
    })
  }
})

export { instantiateDevice, updateDevice, deleteDevice, deviceInstance, initDevices, cleanupDevices, enableDevice, disableDevice }
