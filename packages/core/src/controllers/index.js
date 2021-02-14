import { controllers, panels } from '../db'
import { pubsub } from '../network/graphql/schema'
import log from '../utils/log'
import shortid from 'shortid'
import STATUS from '../utils/statusEnum'

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
          status: STATUS.OK,
          label: `${_controller.manufacturer}-${_controller.model}`,
          ..._controller
        }
      },
      { upsert: true }
    )
      .then(() => {
        log('info', 'core/controllers', `Registered ${id}`)
        resolve(controllers.findOne({ id: id }))
      })
      .catch(e => reject(e))
  })
}

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

const deleteController = id => new Promise(resolve => {
  controllers.deleteOne({ id: id })
  log('info', 'core/controllers', `Deleted Controller ${id}`)
  resolve(STATUS.OK)
})

const publishControllerUpdate = id => new Promise((resolve, reject) => {
  let controllerData
  let panelData
  let update
  controllers.findOne({ id: id })
    .then(controller => controllerData = controller)
    .then(() => (panels.findOne({ id: controllerData.panel.id})))
    .then(panel => panelData = panel)
    .then(() => update = { controller: { ...controllerData, panel: { ...panelData} }})
    .then(() => pubsub.publish('CONTROLLER_UPDATE', update))
    .catch((e) => reject(e))
    .finally(() => resolve(update))
})

const controllerLayouts = [
  { id: 'elgato-streamdeck-mini', label: 'Elgato Streamdeck Mini', rows: 2, columns: 3 },
  { id: 'elgato-streamdeck-original', label: 'Elgato Streamdeck', rows: 3, columns: 5 },
  { id: 'elgato-streamdeck-xl', label: 'Elgato Streamdeck XL', rows: 4, columns: 8 }
]

export { registerController, updateController, deleteController, publishControllerUpdate, controllerLayouts }
