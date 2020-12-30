import { executeStack } from '../../stacks'
import { devices, controllers, panels, stacks } from '../../db'
import { pubsub } from '../../network/graphql/schema'
import { actionTimeouts } from '../../utils/actionTimeouts'
import log from '../../utils/log'
import STATUS from '../../utils/statusEnum'

class ProtocolProviderBorealDirector {
  constructor (_device) {
    this.device = _device
  }

  static providerRegistration = {
    id: 'ProtocolProviderBorealDirector',
    label: 'BorealSystems Director Core',
    parameters: [],
    constructor: ProtocolProviderBorealDirector
  }

  providerFunctions = (args) => new Promise((resolve, reject) => {
    const funcs = [
      {
        id: 'executeStack',
        label: 'Execute Stack',
        parameters: [
          {
            inputType: 'comboBox',
            label: 'Stack',
            id: 'stack',
            placeholder: 'Stack',
            required: true,
            items: async () => {
              const realmFilter = args.realm ? { realm: args.realm } : {}
              const coreFilter = args.core ? { core: args.core } : {}
              return await stacks.find({ ...realmFilter, ...coreFilter }).toArray()
            }
          }
        ]
      },
      {
        id: 'clearAllDelayedActions',
        label: 'Abort all Delayed Actions'
      },
      {
        id: 'writeToLog',
        label: 'Add A Log Message',
        parameters: [
          {
            inputType: 'textInput',
            id: 'content',
            label: 'Log Message',
            required: true,
            placeholder: 'Message to add to log',
            tooltip: 'This log content will appear in the global Director log, and will also be written to file.'
          }
        ]
      },
      {
        id: 'assignControllerPanel',
        label: 'Assign Panel to Controller',
        parameters: [
          {
            inputType: 'comboBox',
            label: 'Controller',
            id: 'controller',
            required: true,
            placeholder: 'Select a Controller',
            items: async () => {
              const realmFilter = args.realm ? { realm: args.realm } : {}
              const coreFilter = args.core ? { core: args.core } : {}
              return [{ id: 'current', label: 'Current Controller' }, ...await controllers.find({ ...realmFilter, ...coreFilter }).toArray()]
            }
          },
          {
            inputType: 'comboBox',
            label: 'Panel',
            id: 'panel',
            required: true,
            placeholder: 'Select a Panel',
            items: async () => {
              const realmFilter = args.realm ? { realm: args.realm } : {}
              const coreFilter = args.core ? { core: args.core } : {}
              return await panels.find({ ...realmFilter, ...coreFilter }).toArray()
            }
          }
        ]
      }
    ]
    resolve(funcs)
  })

  init = () => devices.updateOne({ id: this.device.id }, { $set: { status: STATUS.OK } })

  destroy = () => {}

  recreate = () => {}

  interface = (_action) => {
    switch (_action.providerFunction.id) {
      case 'executeStack':
        executeStack(_action.parameters.stack.id)
        break

      case 'clearAllDelayedActions':
        actionTimeouts.clearAll()
        break

      case 'writeToLog':
        log('info', 'Manual Log', _action.parameters.content)
        break

      case 'assignControllerPanel':
        // eslint-disable-next-line no-case-declarations
        const id = _action.parameters.controller.id === 'current' ? _action.controller : _action.parameters.controller.id
        if (id === 'Shotbox' || id === 'RossTalk') {
          log('warn', `virtual/device/${this.device.id} (${this.device.label})`, 'Not a controller, Skipping remap')
        } else {
          controllers.findOne({ id: id })
          .then((controller, err) => {
            if (err) {
              log('error', 'core/controllers', err)
            } else {
              controllers.updateOne(
                { id: controller.id },
                {
                  $set: {
                    panel: _action.parameters.panel
                  }
                },
                { upsert: true }
                )
              }
            })
            .then(err => {
              if (err) {
                log('error', 'core/controllers', err)
              } else {
                return controllers.findOne({ id: id })
              }
            })
            .then((controller) => {
              log('info', 'core/controllers', `Updated ${controller.id} (${controller.label})`)
              pubsub.publish('CONTROLLER_UPDATE', { controller: controller })
            })
          }
        break
    }
  }
}

export default ProtocolProviderBorealDirector
