import { controllers } from '../db'
import log from '../utils/log'
import { pubsub } from '../network/graphql/schema'

const initControllers = () => {
  return new Promise((resolve, reject) => {
    log('info', 'core/lib/controllers', 'Initialising Controllers')
    resolve()
  })
}

const registerController = (controller) => {
  return new Promise((resolve, reject) => {
    controllers.put(`${controller.manufacturer}-${controller.model}-${controller.serial}`, { ...controller, status: 'online', label: `${controller.manufacturer}-${controller.model}`, id: `${controller.manufacturer}-${controller.model}-${controller.serial}` })
      .then(err => {
        if (err) {
          reject(err)
        } else resolve(200)
      })
  })
}

const updateController = (_controller) => {
  return new Promise((resolve, reject) => {
    controllers.get(_controller.id)
      .then(controller => {
        controllers.put(_controller.id, { ...controller, ..._controller })
      })
      .then(() => {
        pubsub.publish('CONTROLLER_UPDATE', { controller: _controller })
      })
      .then(() => resolve(200))
      .catch(err => reject(err))
  })
}

export { initControllers, registerController, updateController }
