import db from './db'
import system from './system'
const { version, name } = require('../../package.json')
const debug = require('debug')('BorealDirector:src/libs/dbUtils')

const dbload = () => {
  debug('Loading DB')
  db.get('dbState', function (err, value) {
    if (err) {
      if (err.notFound) {
        debug('DB Not Found, assuming first run.')
        dbCreate()
        return
      }
      debug(err)
    }
    if (value === 'init') {
      debug('DB initialised')
    } else if (value === 'stale') {
      debug('DB stale')
    } else {
      debug(value)
    }
  })
}

// eslint-disable-next-line no-undef
var coreSettingsStructure = { name: name, version: version }
debug(`coreSettingsStruct: ${JSON.stringify(coreSettingsStructure)}`)

const dbCreate = () => {
  debug('Creating DB')
  db.put('coreSettings', coreSettingsStructure)
    .then(db.put('dbState', 'init'))
    .catch(function (err) { debug(err) })
  system.emit('db', 'created')
}

export default dbload
