import { executeStack } from '../../stacks'
import { devices } from '../../db'
import log from '../../utils/log'
import STATUS from '../../utils/statusEnum'
// import REGEX from '../../utils/regexEnum'

export default function load (providers) {
  log('info', 'core/lib/deviceProviders/BorealDirector', 'Loaded device provider: BorealSystems - BorealDirector')
  providers.push(descriptor)
}

class BorealDirector {
  constructor (_device) {
    this.device = _device
  }

  init = () => {
    devices.get(this.device.id, (error, value) => {
      if (error) log('error', `virtual/device/${this.device.id}`, error)
      devices.put(this.device.id, { ...value, status: STATUS.OK })
    })
  }

  destroy = () => {}

  recreate = () => {}

  interface = (_action) => {
    switch (_action.providerFunction.id) {
      case 'executeStack':
        executeStack(_action.parameters.find((parameter) => { return parameter.id === 'stack' }).value)
        break

      case 'writeToLog':
        log('info', 'Manual Log', _action.parameters.find((parameter) => { return parameter.id === 'content' }).value)
        break
    }
  }
}

const descriptor = {
  id: 'BorealSystems-DirectorInternal',
  type: 'internal',
  label: 'BorealDirector',
  Construct: BorealDirector,
  parameters: [],
  providerFunctions: [
    {
      id: 'executeStack',
      label: 'Execute Stack',
      parameters: [
        {
          inputType: 'textInput',
          label: 'Stack ID',
          id: 'stack'
        }
      ]
    },
    {
      id: 'writeToLog',
      label: 'Add A Log Message',
      parameters: [
        {
          inputType: 'textInput',
          label: 'Log Content',
          id: 'content'
        }
      ]
    }
  ]
}
