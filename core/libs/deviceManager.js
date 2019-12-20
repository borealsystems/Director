import system from './system'
const debug = require('debug')('BorealDirector:core/libs/deviceManager')

system.on('device_update', (m) => { debug('m') })
