import db from '../db'
import log from '../utils/log'
import { findIndex, uniqBy } from 'lodash'
import { pubsub } from '../network/graphql/schema'

let controllers = []

const initControllers = () => {
  return new Promise((resolve, reject) => {
    log('info', 'core/lib/controllers', 'Initialising Controllers')
    db.get('controllers').then((d) => {
      if (d === undefined) {
        db.set('controllers', [])
        resolve()
      } else {
        controllers = d
        resolve()
      }
    })
  })
}

const registerController = (controller) => {
  log('info', 'core/lib/controllers', `Registering ${controller.serial} (${controller.manufacturer}, ${controller.model})`)
  controllers.push({ ...controller, status: 'online', label: `${controller.manufacturer}-${controller.model}`, id: `${controller.manufacturer}-${controller.model}-${controller.serial}` })
  controllers = uniqBy(controllers, (controller) => { return controller.serial })
  db.set('controllers', controllers)
  return controller
}

const updateController = (_controller) => {
  controllers[findIndex(controllers, element => element.id === _controller.id)] = _controller
  db.set('controllers', controllers)
  pubsub.publish('CONTROLLER_UPDATE', { controller: _controller })
  return '200'
}

export { initControllers, registerController, updateController, controllers }
