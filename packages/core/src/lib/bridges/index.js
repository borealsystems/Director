// import db from '../db'
import log from '../utils/log'
import { uniqBy } from 'lodash'
let bridges = []

const registerBridge = (_bridge) => {
  log('info', 'core/lib/bridges', `Updating Bridge ${_bridge.type} at ${_bridge.address}`)
  bridges.push(_bridge)
  bridges = uniqBy(bridges, (bridge) => { return bridge.address })
  return '200'
}

export { registerBridge, bridges }
