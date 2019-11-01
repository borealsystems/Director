import db from './db'
import system from './system'
const { version, name } = require('../../package.json')
const debug = require('debug')('BorealDirector:src/libs/dbUtils')

const dbLoad = () => {
  debug('Loading DB')
  db.get('state') === undefined ? dbCreate() : system.emit('db', 'loaded')
}

// eslint-disable-next-line no-undef
const coreSettingsStructure = { name: name, version: version }
debug(`coreSettingsStruct: ${JSON.stringify(coreSettingsStructure)}`)

const dbCreate = () => {
  debug('Creating DB')
  db.put('coreSettings', coreSettingsStructure)
  db.put('state', 1)
  system.emit('db', 'created')
}

export default dbLoad
export { dbLoad, dbCreate }
