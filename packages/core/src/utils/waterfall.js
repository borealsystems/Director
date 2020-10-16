import { controllers } from '../controllers'
import { pubsub } from '../network/graphql/schema'
import { cores, devices, stacks, panels } from '../db'
import log from './log'
import { omit } from 'lodash'

const deviceWaterfall = (device) => {
  console.log('Device Waterfall not yet implemented')
}

const stackWaterfall = (stack) => {
  panels.find({ buttons: { $elemMatch: { $elemMatch: { 'stack.id': stack.id } } } }).each((err, panel) => {
    if (err) {
      log('error', 'core/utils/waterfall', err)
    } else if (panel) {
      panel.buttons.map((row, rowIndex) => {
        row.map((button, buttonIndex) => {
          if (button.stack?.id === stack.id) {
            button.stack = omit(stack, ['actions'])
          }
          if (rowIndex === panel.buttons.length - 1 && buttonIndex === row.length - 1) {
            panelWaterfall(panel)
            panels.updateOne(
              { id: panel.id },
              {
                $set: {
                  buttons: panel.buttons
                }
              },
              { upsert: true }
            )
              .then(() => {
                return panels.findOne({ id: panel.id })
              })
              .then(panel => {
                log('info', 'core/lib/panels', `${!panel.id ? 'Creating' : 'Updating'} ${panel.id} (${panel.label})`)
              })
          }
        })
      })
    }
  })
}

const panelWaterfall = (panel) => {
  console.log('Panel Waterfall not yet implemented')
  // controllers.filter(controller => controller.panel.id === panel).map((controller, index) => {
  //   pubsub.publish('CONTROLLER_UPDATE', { controller: controller })
  // })
}

export { deviceWaterfall, stackWaterfall, panelWaterfall }
