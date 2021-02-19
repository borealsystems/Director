import {controllers} from '../db'
import log from '../utils/log'
import shortid from 'shortid'
import STATUS from '../utils/statusEnum'
import { publishControllerUpdate } from './publishControllerUpdate'

const updateController = (_controller) => {
  const generatedid = shortid.generate()
  const id = _controller.id ? _controller.id : `virtual-${generatedid}`
  return new Promise((resolve, reject) => {
    controllers.updateOne(
      { id: id },
      {
        $set: {
          core: _controller.core ? _controller.core : process.env.DIRECTOR_CORE_ID,
          realm: _controller.realm ? _controller.realm : 'ROOT',
          manufacturer: 'Boreal Systems',
          model: 'Virtual Controller',
          serial: generatedid,
          status: STATUS.OK,
          ..._controller
        }
      },
      { upsert: true }
    )
      .then(() => (publishControllerUpdate(id)))
      .then((controller) => {
        log('info', 'core/controllers', _controller.id ? `Updated ${id} (${controller.label}, ${controller.panel.label})` : `Created ${id}`)
      })
      .catch(e => reject(e))
  })
}

export default updateController
