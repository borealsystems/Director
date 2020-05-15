import _osc from 'osc'
import log from '../../log'

const instance = {}

const osc = () => {}

const regexClasses = {
  host: '(^((?:([a-z0-9]\\.|[a-z0-9][a-z0-9\\-]{0,61}[a-z0-9])\\.)+)([a-z0-9]{2,63}|(?:[a-z0-9][a-z0-9\\-]{0,61}[a-z0-9]))\\.?$)|(\b(?:(?:2(?:[0-4][0-9]|5[0-5])|[0-1]?[0-9]?[0-9])\\.){3}(?:(?:2([0-4][0-9]|5 [0-5])|[0-1]?[0-9]?[0-9]))\\b)',
  port: '^([0-9]{1,4}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5])$',
  signed_int: '^-?\\d+$',
  signed_float: '([+-]?(?=\\.\\d|\\d)(?:\\d+)?(?:\\.?\\d*))(?:[eE]([+-]?\\d+))?'
}

osc.init = (providers, providerInterfaces) => {
  providers.push(osc.descriptor)
  const provider = providers.find((provider) => { return provider.id === 'osc' })
  provider.instance = instance
  provider.instance.udpPort = new _osc.UDPPort({
    localAddress: '0.0.0.0',
    localPort: 8000,
    metadata: true
  })

  // TODO: fix OSC recieve
  // TODO: Split providers and protocols into seperate directories
  provider.instance.udpPort.open()
  log('info', 'core/lib/providers/osc', 'Listening for OSC on 0.0.0.0:8000')

  provider.instance.udpPort.on('message', (oscMsg, timeTag, info) => {
    log('debug', 'core/lib/providers/osc', `Recieved ${JSON.stringify(oscMsg)}`)
  })

  provider.instance.udpPort.on('bundle', (oscMsg, timeTag, info) => {
    log('debug', 'core/lib/providers/osc', `Recieved ${JSON.stringify(oscMsg)}`)
  })

  provider.instance.udpPort.on('error', (error) => {
    log('error', 'core/lib/providers/osc', `Experienced Error ${JSON.stringify(error)}`)
  })

  providerInterfaces.push({ id: 'osc', providerInterface: osc.interface })
}

osc.rawInterface = (_host, _port, _address, _args) => {
  instance.udpPort.send({
    address: _address,
    args: _args
  }, _host, _port)
}

osc.descriptor = {
  id: 'osc',
  label: 'Generic OSC',
  protocol: 'OSC',
  parameters: [
    {
      required: true,
      id: 'host',
      label: 'Host',
      regex: regexClasses.host
    },
    {
      required: true,
      id: 'port',
      label: 'Port',
      regex: regexClasses.port
    }
  ],
  providerFunctions: [
    {
      id: 'string',
      label: 'Send String',
      parameters: [
        {
          inputType: 'textInput',
          label: 'OSC Path',
          id: 'path'
        },
        {
          inputType: 'textInput',
          label: 'Value',
          id: 'string',
          regex: regexClasses.signed_int
        }
      ]
    },
    {
      id: 'integer',
      label: 'Send Integer',
      parameters: [
        {
          inputType: 'textInput',
          label: 'OSC Path',
          id: 'path'
        },
        {
          inputType: 'textInput',
          label: 'Value',
          id: 'int',
          regex: regexClasses.signed_int
        }
      ]
    },
    {
      id: 'float',
      label: 'Send Float',
      parameters: [
        {
          inputType: 'textInput',
          label: 'OSC Path',
          id: 'path'
        },
        {
          inputType: 'textInput',
          label: 'Value',
          id: 'float',
          regex: regexClasses.signed_int
        }
      ]
    },
    {
      id: 'path',
      label: 'Send Path',
      parameters: [
        {
          inputType: 'textInput',
          label: 'OSC Path',
          id: 'path'
        }
      ]
    }
  ]
}

osc.interface = (deviceConfig, functionID, actionParameters) => {
  switch (functionID) {
    case 'path':
      osc.rawInterface(
        deviceConfig.find((parameter) => { return parameter.id === 'host' }).value,
        deviceConfig.find((parameter) => { return parameter.id === 'port' }).value,
        actionParameters.find((parameter) => { return parameter.id === 'path' }).value
      )
      break
    case 'string':
      osc.rawInterface(
        deviceConfig.find((parameter) => { return parameter.id === 'host' }).value,
        deviceConfig.find((parameter) => { return parameter.id === 'port' }).value,
        actionParameters.find((parameter) => { return parameter.id === 'path' }).value,
        [
          {
            type: 's',
            value: actionParameters.find((parameter) => { return parameter.id === 'string' }).value
          }
        ]
      )
      break
    case 'integer':
      osc.rawInterface(
        deviceConfig.find((parameter) => { return parameter.id === 'host' }).value,
        deviceConfig.find((parameter) => { return parameter.id === 'port' }).value,
        actionParameters.find((parameter) => { return parameter.id === 'path' }).value,
        [
          {
            type: 'i',
            value: actionParameters.find((parameter) => { return parameter.id === 'int' }).value
          }
        ]
      )
      break
    case 'float':
      osc.rawInterface(
        deviceConfig.find((parameter) => { return parameter.id === 'host' }).value,
        deviceConfig.find((parameter) => { return parameter.id === 'port' }).value,
        actionParameters.find((parameter) => { return parameter.id === 'path' }).value,
        [
          {
            type: 'f',
            value: actionParameters.find((parameter) => { return parameter.id === 'float' }).value
          }
        ]
      )
      break
  }
}

export default osc
