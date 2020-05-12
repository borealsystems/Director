import _osc from 'osc'
import log from '../log'
import { providerInterfaces } from './index'

const instance = {}

const oscInit = (provider) => {
  provider.instance = instance
  provider.instance.udpPort = new _osc.UDPPort({
    localAddress: '0.0.0.0',
    localPort: 7000,
    metadata: true
  })

  // Open the socket.
  provider.instance.udpPort.open()
  log('info', 'core/lib/providers/osc', 'Listening for OSC on 0.0.0.0:7000')

  // Listen for incoming OSC messages.
  provider.instance.udpPort.on('message', (oscMsg, timeTag, info) => {
    log('debug', 'core/lib/providers/osc', `Recieved ${JSON.stringify(oscMsg)}`)
  })

  providerInterfaces.push({ id: 'osc', providerInterface: oscInterface })
}

const oscSend = (_host, _port, _address, _args) => {
  instance.udpPort.send({
    address: _address,
    args: _args
  }, _host, _port)
}

const oscInterface = (deviceConfig, functionID, actionParameters) => {
  switch (functionID) {
    case 'path':
      oscSend(
        deviceConfig.find((parameter) => { return parameter.id === 'host' }).value,
        deviceConfig.find((parameter) => { return parameter.id === 'port' }).value,
        actionParameters.find((parameter) => { return parameter.id === 'path' }).value
      )
      break
    case 'string':
      oscSend(
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
      oscSend(
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
      oscSend(
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

export { oscInit, oscSend }
