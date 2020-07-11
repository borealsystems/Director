import log from './utils/log'

const Keyv = require('keyv')
const KeyvFile = require('keyv-file')

log('info', 'core/lib/db', 'DB Loading')

const db = new Keyv({
  store: new KeyvFile(
    {
      filename: '../../director.db'
    }
  )
})

db.on('error', err => log('error', 'core/lib/db', err))

export default db
