// TODO: Make this
import db from './db'
import find from 'lodash/find'
const debug = require('debug')('BorealDirector:core/libs/actionExecuter')

const actionExecuter = (_uuid) => {
  var action = find(db.get('actions'), { uuid: _uuid })
  debug(`executing ${action.uuid}`)
}

export default actionExecuter
