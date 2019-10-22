import db from './db'
const { version, name } = require('../../package.json')
const debug = require('debug')('src/libs/dbUtils')

const dbload = () => {
  debug('Loading DB')
  db.get('state', function (err, value) {
    if (err) {
      if (err.notFound) {
        debug('DB Not Found, assuming first run.')
        dbCreate()
        return
      }
      debug(err)
    }
  })
}

// eslint-disable-next-line no-undef
var coreSettingsStructure = { name: name, version: version }
debug(JSON.stringify(coreSettingsStructure))

const dbCreate = () => {
  debug('Creating DB')
  db.put('coreSettings', coreSettingsStructure)
    .catch(function (err) { debug(err) })
}

export default dbload
