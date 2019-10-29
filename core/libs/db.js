const level = require('level')
const path = require('path')
const debug = require('debug')('BorealDirector:src/libs/db')
const fs = require('fs')

const osConfigDir = process.env.APPDATA || (process.platform === 'darwin' ? process.env.HOME + '/Library/Application Support' : process.env.HOME + '/.config')
const dbDir = path.join(osConfigDir, 'BorealDirector')

if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir)
}

const dbLocation = path.join(dbDir, 'database')

debug(`DB Location: ${dbLocation}`)
const db = level(dbLocation, { valueEncoding: 'json' })

export default db
