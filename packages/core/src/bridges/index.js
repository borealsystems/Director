// import db from '../db'
import log from '../utils/log'
import { registerController } from "../controllers/registerController"
import { uniqBy } from 'lodash'

let bridges = []

const initBridges = () => {}

const registerBridge = (_bridge) => {
  if (_bridge.controllers) {
    _bridge.controllers.map((controller) => {
      registerController(controller)
    })
  }
  bridges.push(_bridge)
  bridges = uniqBy(bridges, (bridge) => { return bridge.address })
  log('info', 'core/bridges', `Updated Bridge ${_bridge.type} with ${_bridge.controllers.length} controllers`)
  return `Updated Bridge ${_bridge.type} with ${_bridge.controllers.length} controllers`
}

export { initBridges, registerBridge, bridges }
