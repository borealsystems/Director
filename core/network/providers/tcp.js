const debug = require('debug')('BorealDirector:core/network/tcp')
const net = require('net')

const ProviderRequirements = ['ip', 'port']

class TCPClient {
  constructor (host, port) {
    debug(host, port)
    this.client = new net.Socket()
    this.client.connect(port, host, function () {
      debug('CONNECTED TO: ' + host + ':' + port)
    })
    debug(ProviderRequirements)
  }

  send (command) {
    this.client.write(command)
    debug(command)
  }

  close () {
    this.client.destroy()
  }
}

export default TCPClient
