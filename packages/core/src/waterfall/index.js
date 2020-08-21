import { controllers } from '../controllers'
import { pubsub } from '../network/graphql/schema'

const dependent = { controllers: [], panels: [], stacks: [], devices: [] }

const waterfall = (type, id) => {
  const deviceWaterfall = (device) => {
    console.log('Device Waterfall')
  }

  const stackWaterfall = (stack) => {
    console.log('Stack Waterfall')
  }

  const panelWaterfall = (panel) => {
    console.log('Panel Waterfall')
    controllers.filter(controller => controller.panel.id === panel).map((controller, index) => {
      pubsub.publish('CONTROLLER_UPDATE', { controller: controller })
    })
  }

  switch (type) {
    case 'device':
      deviceWaterfall(id)
      break

    case 'stack':
      stackWaterfall(id)
      break

    case 'panel':
      panelWaterfall(id)
      break
  }
}

export { dependent, waterfall }
