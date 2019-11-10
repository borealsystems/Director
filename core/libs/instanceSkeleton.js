const debug = require('debug')('Director:core/libs/instanceSkeleton')

class instanceSkeleton {
  constructor (id, bdds, name, config) {
    this.definition = bdds
    this.name = name || this.definition.name
    this.id = id
    this.config = config
    debug(this.name)
    debug(this.id)
  }

  parseDefinition () {
    debug('Parsing BDDS')
    this.communicationProvider = this.bdds.communicationProvider
    if (this.communicationProvider === 'RossTalk') {
    }
  }
}

export default instanceSkeleton
