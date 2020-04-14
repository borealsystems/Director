import log from './log'

const Keyv = require('keyv')
const KeyvFile = require('keyv-file')

log('info', 'core/lib/db', 'DB Loading')

const db = new Keyv({
  store: new KeyvFile(
    {
      filename: 'db'
    }
  )
})

export default db
