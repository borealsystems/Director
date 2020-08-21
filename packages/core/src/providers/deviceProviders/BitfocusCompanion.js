import { GenericOSC } from '../protocolProviders/GenericOSC'
import log from '../../utils/log'
// import STATUS from '../../utils/statusEnum'
import REGEX from '../../utils/regexEnum'

export default function load (providers) {
  log('info', 'core/lib/deviceProviders/BitfocusCompanion', 'Loaded device provider: Bitfocus - Companion')
  providers.push(descriptor)
}

class BitfocusCompanion extends GenericOSC {
  interface = (_action) => {
    switch (_action.providerFunction.id) {
      case 'toggle':
        this.rawInterface(
          `/press/bank/${_action.parameters.find((parameter) => { return parameter.id === 'page' }).value}/${_action.parameters.find((parameter) => { return parameter.id === 'button' }).value}`,
          []
        )
        break

      case 'press':
        this.rawInterface(
          `/press/bank/${_action.parameters.find((parameter) => { return parameter.id === 'page' }).value}/${_action.parameters.find((parameter) => { return parameter.id === 'button' }).value}`,
          []
        )
        break
    }
  }
}

const descriptor = {
  id: 'bitfocus-companion',
  type: 'device',
  label: 'Bitfocus Companion',
  Construct: BitfocusCompanion,
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
      id: 'toggle',
      label: 'Toggle Button',
      parameters: [
        {
          inputType: 'textInput',
          label: 'Page',
          id: 'page'
        },
        {
          inputType: 'textInput',
          label: 'Button',
          id: 'button'
        }
      ]
    },
    {
      id: 'press',
      label: 'Press Button (Down Action)',
      parameters: [
        {
          inputType: 'textInput',
          label: 'Page',
          id: 'page'
        },
        {
          inputType: 'textInput',
          label: 'Button',
          id: 'button'
        }
      ]
    },
    {
      id: 'release',
      label: 'Release Button (Up Action)',
      parameters: [
        {
          inputType: 'textInput',
          label: 'Page',
          id: 'page'
        },
        {
          inputType: 'textInput',
          label: 'Button',
          id: 'button'
        }
      ]
    }
  ]
}
