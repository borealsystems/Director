import ConnectionProviderTCP from '../connectionProviders/ConnectionProviderTCP'

class ProtocolProviderRossTalk extends ConnectionProviderTCP {
  static providerRegistration = {
    id: 'ProtocolProviderRossTalk',
    label: 'Protocol: RossTalk',
    manufacturer: 'Generic',
    protocol: 'RossTalk',
    description: 'This generic RossTalk provider allows you to send custom commands to any device supporting RossTalk control.',
    category: 'Protocol',
    parameters: this.parameters,
    defaults: [null, 7788],
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
