import _osc from 'osc'
import log from '../log'

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
}

const oscSend = (_host, _port, _address, _args) => {
  instance.udpPort.send({
    address: _address,
    args: _args
  }, _host, _port)
}

export { oscInit, oscSend }
