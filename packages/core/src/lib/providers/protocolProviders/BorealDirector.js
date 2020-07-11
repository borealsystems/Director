import { executeStack } from '../../stacks'
import log from '../../utils/log'
// import STATUS from '../../utils/statusEnum'
// import REGEX from '../../utils/regexEnum'

const load = (providers) => {
  log('info', 'core/lib/protocolProviders/internal', 'Loaded protocol provider: Boreal Systems - BorealDirector')
  providers.push(descriptor)
}

class BorealDirector {
  constructor (_device) {
    this.device = _device
  }

  init = () => {

  }

  destroy = () => {
    // if (this.socket.destroyed !== true) {
    //   this.socket.destroy()
    // }
  }

  recreate = () => {
    this.destroy()
    this.init()
  }

  interface = (_action) => {
    switch (_action.providerFunction.id) {
      case 'executeStack':
        executeStack(_action.actionParameters.find((parameter) => { return parameter.id === 'stack' }).value)
        break
    }
  }
}

export { load }

const descriptor = {
  id: 'internal',
  type: 'internal',
  label: 'Internal',
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
    }
  ]
}
