import mutableconf from '../libs/mutableconf/src'
var debug = require('debug')('director:src/core/main')

debug('Loading Conf')
mutableconf.init('conf.json')
  .then(conf => debug(`Config Initialised ${conf}`))
  .catch(err => debug(err))
