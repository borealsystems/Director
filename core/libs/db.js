const Storage = require('node-storage')
const path = require('path')
const debug = require('debug')('BorealDirector:src/libs/db')
const fs = require('fs')

const osConfigDir = process.env.APPDATA || (process.platform === 'darwin' ? process.env.HOME + '/Library/Application Support' : process.env.HOME + '/.config')
const dbDir = path.join(osConfigDir, 'BorealDirector')

if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir)
}

const dbLocation = (process.env.NODE_ENV === 'development' ? path.join('database.json') : path.join(dbDir, 'database.json'))

debug(`DB Location: ${dbLocation}`)
const db = new Storage(dbLocation)

export default db
