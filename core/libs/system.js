const EventEmitter = require('events')

class EmitterClass extends EventEmitter {}

const emitterCore = new EmitterClass()

module.exports = emitterCore
