import { controllers } from '../db'
import log from '../utils/log'
import { pubsub } from '../network/graphql/schema'

const registerController = (_controller) => {
  return new Promise((resolve, reject) => {
    const id = `${_controller.manufacturer}-${_controller.model}-${_controller.serial}`
    controllers.updateOne(
      { id: id },
      {
        $set: {
          core: _controller.core ? _controller.core : process.env.DIRECTOR_CORE_ID,
          realm: _controller.realm ? _controller.realm : 'ROOT',
          id: id,
          status: 'online',
          label: `${_controller.manufacturer}-${_controller.model}`,
          ..._controller
        }
      },
      { upsert: true }
    )
      .then(() => {
        log('info', 'core/lib/controllers', `Registered ${id}`)
        resolve(controllers.findOne({ id: id }))
      })
      .catch(e => reject(e))
  })
}

const updateController = (_controller) => {
  return new Promise((resolve, reject) => {
    controllers.updateOne(
      { id: _controller.id },
      {
        $set: {
          core: _controller.core ? _controller.core : process.env.DIRECTOR_CORE_ID,
          realm: _controller.realm ? _controller.realm : 'ROOT',
          status: 'online',
          label: `${_controller.manufacturer}-${_controller.model}`,
          ..._controller
        }
      },
      { upsert: true }
    )
      .then(() => {
        return controllers.findOne({ id: _controller.id })
      })
      .then((controller) => {
        log('info', 'core/lib/controllers', `Updated ${controller.id}`)
        pubsub.publish('CONTROLLER_UPDATE', { controller: controller })
      })
      .catch(e => reject(e))
  })
}

export { registerController, updateController }
