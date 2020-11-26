import net from 'net'
import { devices } from '../../db'
import log from '../../utils/log'
import STATUS from '../../utils/statusEnum'
import REGEX from '../../utils/regexEnum'

class ConnectionProviderTCP {
  constructor (_device) {
    this.device = _device
  }

  static parameters = [
    {
      inputType: 'textInput',
      id: 'host',
      label: 'Host',
      required: true,
      regex: REGEX.HOST,
      placeholder: 'Device Host'
    },
    {
      inputType: 'numberInput',
      id: 'port',
      label: 'Port',
      required: true,
      regex: REGEX.PORT,
      tooltip: 'This device\'s connection provider needs to connect to a port via TCP'
    }
  ]

  init = () => {
    this.socket = new net.Socket()
    this.socket.connect(this.device.configuration.port, this.device.configuration.host)
    this.socket.setKeepAlive(true, 0)

    this.socket.on('connect', () => {
      log('info', `virtual/device/${this.device.id} (${this.device.label})`, 'Socket Connected')
      devices.updateOne({ id: this.device.id }, { $set: { status: STATUS.OK } })
    })

    this.socket.on('error', (error) => {
      log('error', `virtual/device/${this.device.id} (${this.device.label})`, `${error}`)
      devices.updateOne({ id: this.device.id }, { $set: { status: STATUS.ERROR } })
    })

    this.socket.on('close', () => {
      devices.updateOne({ id: this.device.id }, { $set: { status: STATUS.CLOSED } })
      switch (this.doNotRecreate) {
        case true:
          break
        case false:
          log('error', `virtual/device/${this.device.id} (${this.device.label})`, 'Socket Closed, Reconnecting in 10 Seconds')
          setTimeout(() => this.recreate(), 10000)
      }
    })
  }

  destroy = (callback) => {
    log('info', `virtual/device/${this.device.id} (${this.device.label})`, 'Destroying Instance')
    this.doNotRecreate = true
    if (this.socket) {
      this.socket.destroy()
    }
    if (typeof callback === 'function') {
      callback()
    }
  }

  recreate = () => {
    this.destroy()
    this.init()
  }

  connectionProviderInterface = ({ message }) => {
    this.socket.write(message)
  }
}

export default ConnectionProviderTCP
