const EventEmitter = require('events')

class EmitterClass extends EventEmitter {}

const system = new EmitterClass()

export default system
