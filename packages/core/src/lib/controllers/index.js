import db from '../db'
import log from '../utils/log'

const registerController = (controller) => {
  log('info', 'core/lib/controllers', `Registering ${controller.serialNumber} (${controller.manufacturer}, ${controller.model})`)
  return controller.serialNumber
}

export { registerController }
