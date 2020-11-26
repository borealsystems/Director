import ConnectionProviderTCP from '../connectionProviders/ConnectionProviderTCP'

class ProtocolProviderTCP extends ConnectionProviderTCP {
  static providerRegistration = {
    id: 'ProtocolProviderTCP',
    label: 'Protocol: TCP',
    manufacturer: 'Generic',
    protocol: 'TCP',
    description: 'This generic TCP provider allows you to send custom commands to any device supporting TCP control.',
    category: 'Protocol',
    parameters: this.parameters,
    constructor: ProtocolProviderTCP
  }

  providerFunctions = [
    {
      id: 'message',
      label: 'Send ASCII over TCP',
      parameters: [
        {
          inputType: 'textInput',
          label: 'ASCII string',
          id: 'message'
        }
      ]
    }
  ]

  interface = (_action) => {
    switch (_action.providerFunction.id) {
      case 'message':
        this.connectionProviderInterface({
          message: `${_action.parameters.message}\r`
        })
        break
    }
  }
}

export default ProtocolProviderTCP
