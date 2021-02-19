import { controllers } from '../db';
import { pubsub } from '../network/graphql/schema';
import { getPanel } from '../panels'

const publishControllerUpdate = id => new Promise((resolve, reject) => {
  let controllerData
  let panelData
  let update
  controllers.findOne({ id: id })
    .then(controller => controllerData = controller)
    .then(() => (getPanel(controllerData.panel.id)))
    .then(panel => panelData = panel)
    .then(() => update = { controller: { ...controllerData, panel: { ...panelData} }})
    .then(() => pubsub.publish('CONTROLLER_UPDATE', update))
    .catch((e) => reject(e))
    .finally(() => resolve(update))
})

export default publishControllerUpdate
