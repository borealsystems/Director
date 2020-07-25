import db from '../db'
import log from '../utils/log'
import omitDeep from '../utils/omitDeep'
import { omit, findIndex, remove } from 'lodash'
import shortid from 'shortid'
import { providers } from '../providers'

const devices = []

const initDevices = (callback) => {
  db.get('devices').then((d) => {
    if (d === undefined) {
      devices.push({
        label: 'BorealSystems Director',
        id: '0',
        location: 'The Void',
        provider: { id: 'internal', label: 'BorealDirector' },
        enabled: true,
        status: '1',
        description: 'The Director Core'
      })
      db.set('devices', omitDeep(devices, 'instance'))
    } else {
      let counter = d.length
      d.map((item, index) => {
        devices.push(item)
        instantiateDevice(item.id)
        counter--
        if (counter === 0) { callback() }
      })
    }
  })
}

const cleanupDevices = () => {
  devices.forEach(device => device.instance.destroy())
}

const updateDevice = (_device) => {
  switch (_device.id !== undefined) {
    case true: {
      devices.find(device => device.id === _device.id).instance.destroy()
      devices[findIndex(devices, item => item.id === _device.id)] = { ...devices[devices.indexOf(item => item.id === _device.id)], ..._device }
      db.set('devices', omitDeep(devices, 'instance'))
      // devices.find(device => device.id === _device.id).instance.recreate()
      instantiateDevice(_device.id)
      log('info', 'core/lib/devices', `Updating ${_device.id} (${_device.label})`)
      return _device.id
    }
    case false: {
      const device = { id: shortid.generate(), ..._device }
      devices.push(device)
      db.set('devices', omitDeep(devices, 'instance'))
      log('info', 'core/lib/devices', `Creating ${device.id} (${device.label})`)
      instantiateDevice(device.id)
      return device.id
    }
  }
}

const instantiateDevice = (_id) => {
  const device = devices.find(({ id }) => id === _id)
  const provider = providers.find(({ id }) => id === device.provider.id)
  device.instance = new provider.Construct(device.instance ? device : omit(device, 'instance'))
  device.instance.init()
  log('info', 'core/lib/devices', `Instantiated ${device.id} (${device.label}) with ${device.provider.label}`)
}

const deleteDevice = (_id) => {
  if (_id === '0') {
    log('info', 'core/lib/devices', 'You Can\'t Delete BorealDirector from BorealDirector')
    return 'error'
  } else {
    let removedDevice = {}
    devices.find(device => device.id === _id).instance.destroy(() => {
      removedDevice = remove(devices, (item) => {
        return item.id === _id
      })
    })
    if (!devices.find((item) => { return item.id === _id })) {
      log('info', 'core/lib/devices', `Deleted ${_id} (${removedDevice[0].label})`)
      // console.log('devices omitted', omitDeep(devices, 'instance'))
      // const devicesToSave = []
      // let counter = devices.length
      // devices.forEach(element => {
      //   devicesToSave.push(omit(element, 'instance'))
      //   counter--
      //   if (counter === 0) {
      //     db.set('devices', devicesToSave)
      //   }
      // })
      db.set('devices', omitDeep(devices, 'instance'))
      return 'ok'
    } else {
      log('error', 'core/lib/devices', `Deletion of ${_id} (${removedDevice[0].label}) failed.`)
      return 'error'
    }
  }
}
export { instantiateDevice, updateDevice, deleteDevice, devices, initDevices, cleanupDevices }
