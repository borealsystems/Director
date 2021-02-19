import {controllers} from '../db';
import log from '../utils/log';
import STATUS from '../utils/statusEnum';

const deleteController = id => new Promise(resolve => {
  controllers.deleteOne({ id: id })
  log('info', 'core/controllers', `Deleted Controller ${id}`)
  resolve(STATUS.OK)
})

export default deleteController
