import ConnectionProviderTCP from '../connectionProviders/ConnectionProviderTCP'

class ProtocolProviderRossTalk extends ConnectionProviderTCP {
  static providerRegistration = {
    id: 'ProtocolProviderRossTalk',
    label: 'Protocol: RossTalk',
    parameters: this.parameters,
    constructor: ProtocolProviderRossTalk
  }

  providerFunctions = [
    {
      id: 'message',
      label: 'Send RossTalk Message',
      parameters: [
        {
          inputType: 'textInput',
          label: 'RossTalk Message',
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

export default ProtocolProviderRossTalk
