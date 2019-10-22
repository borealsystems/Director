const level = require('level')
const debug = require('debug')('src/libs/db')

const db = level('database', { valueEncoding: 'json' })
debug('Initialising DB')

const dbload = () => {
  db.get('state')
    .then(value => debug(value))
    .catch(err => debug(err))
}

// const dbInit = () => {

// }

export default dbload
