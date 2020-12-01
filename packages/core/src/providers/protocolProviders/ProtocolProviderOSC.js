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
          id: 'address',
          label: 'Address',
          required: true,
          placeholder: 'OSC Address'
        },
        {
          inputType: 'textInput',
          id: 'string',
          label: 'Value',
          required: true,
          placeholder: 'String to send'
        }
      ]
    },
    {
      id: 'integer',
      label: 'Send Integer',
      parameters: [
        {
          inputType: 'textInput',
          id: 'address',
          label: 'Address',
          required: true,
          placeholder: 'OSC Address'
        },
        {
          inputType: 'numberInput',
          id: 'int',
          label: 'Value',
          required: true,
          placeholder: 'Integer to send',
          invalidText: 'This number is required to be a signed integer',
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
          id: 'address',
          label: 'Address',
          required: true,
          placeholder: 'OSC Address'
        },
        {
          inputType: 'numberInput',
          id: 'float',
          label: 'Value',
          required: true,
          placeholder: 'Float to send',
          invalidText: 'This number is required to be a float',
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
          id: 'address',
          label: 'Address',
          required: true,
          placeholder: 'OSC Address'
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
