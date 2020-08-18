import { GenericOSC } from '../protocolProviders/GenericOSC'
import log from '../../utils/log'
// import STATUS from '../../utils/statusEnum'
import REGEX from '../../utils/regexEnum'

export default function load (providers) {
  log('info', 'core/lib/deviceProviders/Resolume', 'Loaded protocol provider: Generic - OSC')
  providers.push(descriptor)
}

class ResolumeArena extends GenericOSC {
  interface = (_action) => {
    switch (_action.providerFunction.id) {
      case 'column':
        this.rawInterface(
          `/composition/columns/${_action.parameters.find((parameter) => { return parameter.id === 'column' }).value}/connect`,
          [
            {
              type: 'i',
              value: 1
            }
          ]
        )
        break
      case 'clearComp':
        this.rawInterface(
          '/composition/disconnectall',
          [
            {
              type: 'i',
              value: 1
            }
          ]
        )
        break
    }
  }
}

const descriptor = {
  id: 'resolume',
  type: 'device',
  label: 'Resolume Arena',
  Construct: ResolumeArena,
  protocol: 'osc',
  parameters: [
    {
      required: true,
      id: 'host',
      label: 'Host',
      regex: REGEX.HOST
    },
    {
      required: true,
      id: 'port',
      label: 'Port',
      regex: REGEX.PORT
    }
  ],
  providerFunctions: [
    {
      id: 'column',
      label: 'Connect Column',
      parameters: [
        {
          inputType: 'textInput',
          label: 'Column',
          id: 'column'
        }
      ]
    },
    {
      id: 'clearComp',
      label: 'Clear Composition',
      parameters: [
      ]
    }
  ]
}
