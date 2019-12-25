import db from './db'
import { devices, definitions, providerConnections } from './globals'
import { find } from 'lodash'

// eslint-disable-next-line no-unused-vars
import Rosstalk from '../network/providers/rosstalk'

const uuidBase62 = require('uuid-base62')
const debug = require('debug')('BorealDirector:core/libs/deviceManager')

const deviceCreate = (_config) => {
  const uuid = uuidBase62.v4()
  db.put(`devices.${uuid}`, _config)
  devices.push(uuid)
  debug(`Device ${uuid} Created`)
  initialiseDevice(uuid, _config)
  return uuid
}

const deviceModify = (_uuid, _config) => {

}

const deviceDelete = (_uuid) => {
  db.remove(`devices.${_uuid}`)
  debug(`Device ${_uuid} Deleted`)
}

const initialiseDevice = (_uuid, _device) => {
  const provider = find(definitions, { name: _device.definition }).provider
  switch (provider) {
    case 'rosstalk':
      providerConnections.push({ uuid: _uuid, connection: new Rosstalk(_device.config.ip, _device.config.port) })
      debug(providerConnections)
  }
}

export { deviceCreate, deviceModify, deviceDelete }
