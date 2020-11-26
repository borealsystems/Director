import ConnectionProviderOSC from '../connectionProviders/ConnectionProviderOSC'
import REGEX from '../../utils/regexEnum'

class ProtocolProviderOSC extends ConnectionProviderOSC {
  static providerRegistration = {
    id: 'ProtocolProviderOSC',
    label: 'Protocol: OSC',
    manufacturer: 'Generic',
    protocol: 'OSC',
    description: 'This generic OSC provider allows you to send custom commands to any device supporting OSC control.',
    category: 'Protocol',
    parameters: this.parameters,
    constructor: ProtocolProviderOSC
  }

  providerFunctions = [
    {
      id: 'string',
      label: 'Send String',
      parameters: [
        {
          inputType: 'textInput',
          label: 'OSC Address',
          id: 'address'
        },
        {
          inputType: 'textInput',
          label: 'Value',
          id: 'string'
        }
      ]
    },
    {
      id: 'integer',
      label: 'Send Integer',
      parameters: [
        {
          inputType: 'textInput',
          label: 'OSC Address',
          id: 'address'
        },
        {
          inputType: 'textInput',
          label: 'Value',
          id: 'int',
          regex: REGEX.SIGNEDINT
        }
      ]
    },
    {
      id: 'float',
      label: 'Send Float',
      parameters: [
        {
          inputType: 'textInput',
          label: 'OSC Address',
          id: 'address'
        },
        {
          inputType: 'textInput',
          label: 'Value',
          id: 'float',
          regex: REGEX.SIGNEDFLOAT
        }
      ]
    },
    {
      id: 'address',
      label: 'Send address',
      parameters: [
        {
          inputType: 'textInput',
          label: 'OSC Address',
          id: 'address'
        }
      ]
    }
  ]

  interface = (_action) => {
    switch (_action.providerFunction.id) {
      case 'address':
        this.connectionProviderInterface({
          address: _action.parameters.address
        })
        break
      case 'string':
        this.connectionProviderInterface({
          address: _action.parameters.address,
          args: [
            {
              type: 's',
              value: _action.parameters.string
            }
          ]
        })
        break
      case 'integer':
        this.connectionProviderInterface({
          address: _action.parameters.address,
          args: [
            {
              type: 'i',
              value: _action.parameters.int
            }
          ]
        })
        break
      case 'float':
        this.connectionProviderInterface({
          address: _action.parameters.address,
          args: [
            {
              type: 'f',
              value: _action.parameters.float
            }
          ]
        })
        break
    }
  }
}

export default ProtocolProviderOSC
