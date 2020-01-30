import db from './db'
import uuidBase62 from 'uuid-base62'
const debug = require('debug')('BorealDirector:core/libs/actionManager')

const actionManager = () => {}

actionManager.createAction = (_name, _device, _function, _params) => {
  const _uuid = uuidBase62.v4()
  debug('Creating Action')
  db.push('actions', [...db.get('actions'), { uuid: _uuid, name: _name, device: _device, function: _function, params: _params }])
}

export default actionManager
