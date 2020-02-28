import _osc from 'osc'
import log from '../../log'

class oscProvider {
  contructor (host, port) {
    this.name = 'oscProvider'
    this.label = 'Generic OSC'
    this.protocol = 'osc'
    this.configuration = { host: host, port: port }
  }

  initialise () {
    this.udpPort = new _osc.UDPPort({
      localAddress: '0.0.0.0',
      localPort: 0,
      metadata: true
    })

    // Listen for incoming OSC messages.
    this.udpPort.on('message', (oscMsg, timeTag, info) => {
      log('debug', 'core/lib/network/providers/osc', oscMsg)
      console.log('Remote info is: ', info)
    })

    // Open the socket.
    this.udpPort.open()
  }

  send (_address, _args) {
    this.udpPort.send({
      address: _address,
      args: _args
    }, this.configuration.host, this.configuration.port)
  }
}

export default oscProvider
