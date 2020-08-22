import { devices } from '../db'
import log from '../utils/log'
import shortid from 'shortid'
import { providers } from '../providers'

const deviceInstance = {}

const initDevices = () => {
  return new Promise((resolve, reject) => {
    log('info', 'core/lib/devices', 'Loading Devices')
    devices.get('0', (err, value) => {
      if (err) {
        if (err.notFound) {
          devices.put('0', {
            id: '0',
            label: 'BorealSystems Director',
            location: 'The Void',
            provider: { id: 'BorealSystems-DirectorInternal', label: 'BorealDirector' },
            enabled: true,
            status: 'OK',
            description: 'The Director Core'
          }, err => {
            if (err) log('error', 'core/lib/devices/index.js/initDevices', err)
            devices.get('0', function (err, value, key) {
              if (err) {
              }
              instantiateDevice('0')
            })
          })
          return
        }
        log('error', 'core/lib/devices', err)
      } else {
        devices.createReadStream()
          .on('data', function (data) {
            instantiateDevice(data.value.id)
          })
          .on('error', function (err) {
            log('error', 'core/lib/devices/index.js/initDevices', err)
          })
      }
    })
  })
}

const cleanupDevices = () => {
  Object.keys(deviceInstance).forEach(device => device.instance.destroy())
}

const updateDevice = (_device) => {
  switch (_device.id !== undefined) {
    case true: {
      devices.put(_device.id, _device, () => {
        instantiateDevice(_device.id)
      })
      log('info', 'core/lib/devices', `Updated ${_device.id} (${_device.label})`)
      return _device
    }
    case false: {
      const device = { id: shortid.generate(), ..._device }
      devices.put(device.id, device, () => {
        instantiateDevice(device.id)
      })
      log('info', 'core/lib/devices', `Created ${device.id} (${device.label})`)
      return device
    }
  }
}

const instantiateDevice = (_id) => {
  devices.get(_id, (err, value) => {
    if (err) log('error', 'core/lib/devices/index.js/instantiatetDevice', err)
    const provider = providers.find((provider) => provider.id === value.provider.id)
    if (deviceInstance[_id]) {
      deviceInstance[_id].destroy()
      deviceInstance[_id].init()
    } else {
      deviceInstance[_id] = new provider.Construct(value)
      deviceInstance[_id].init()
    }
    log('info', 'core/lib/devices', `Instantiated ${_id} (${value.label}) with ${value.provider.label}`)
  })
}

const deleteDevice = (_id) => {
  if (_id === '0') {
    log('info', 'core/lib/devices', 'You Can\'t Delete BorealDirector from BorealDirector')
    return 'error'
  } else {
    log('info', 'core/lib/devices', `Deleted Device ${_id}`)
    deviceInstance[_id].destroy()
    devices.del(_id)
  }
}

export { instantiateDevice, updateDevice, deleteDevice, deviceInstance, initDevices, cleanupDevices }
