import { pubsub } from '../network/graphql/schema'
// eslint-disable-next-line no-unused-vars
import { cores, devices, stacks, panels, controllers } from '../db'
import log from './log'
import { omit } from 'lodash'
import { publishControllerUpdate } from '../controllers'

const deviceWaterfall = (device, isDelete) => {
  log('error', 'core/utils/waterfall', 'Device Waterfall not yet implemented')
}

const stackWaterfall = (stack, isDelete) => {
  if (isDelete) {
    panels.find({ buttons: { $elemMatch: { $elemMatch: { 'stack.id': stack.id } } } }).each((err, panel) => {
      if (err) {
        log('error', 'core/utils/waterfall', err)
      } else if (panel) {
        panel.buttons.map((row, rowIndex) => {
          row.map((button, buttonIndex) => {
            if (button.stack?.id === stack.id) {
              button.stack = null
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
                  log('info', 'core/panels', `Updating ${panel.id} (${panel.label})`)
                })
            }
          })
        })
      }
    })
    stacks.find({ actions: { $elemMatch: { parameters: { $elemMatch: { id: 'stack', 'value.id': stack.id } } } } }).each((err, _stack) => {
      if (err) {
        log('error', 'core/utils/waterfall', err)
      } else if (_stack) {
        stacks.updateOne(
          { id: _stack.id },
          {
            $set: {
              actions: _stack.actions.filter(action => (action.parameters[0]?.value?.id !== stack.id))
            }
          },
          { upsert: true }
        )
          .then(() => {
            return stacks.findOne({ id: _stack.id })
          })
          .then(stack => {
            log('info', 'core/panels', `Updated ${stack.id} (${stack.label})`)
          })
      }
    })
  } else {
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
                  log('info', 'core/panels', `${!panel.id ? 'Creating' : 'Updating'} ${panel.id} (${panel.label})`)
                })
            }
          })
        })
      }
    })
  }
}

const panelWaterfall = async (panel, isDelete) => {
  const controllerArray = await controllers.find({ 'panel.id': panel.id }).toArray()
  if (isDelete) {
    controllerArray.map((controller, index) => {
      controllers.updateOne(
        { id: controller.id },
        {
          $set: {
            panel: null
          }
        },
        { upsert: true }
      )
        .then(() => {
          publishControllerUpdate(controller.id)
        })
    })
  } else {
    controllerArray.map((controller, index) => {
      publishControllerUpdate(controller.id)
      log('info', 'core/waterfall', `Updated ${controller.id} (${controller.label})`)
    })
  }
}

export { deviceWaterfall, stackWaterfall, panelWaterfall }
