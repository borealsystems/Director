import net from 'net'
import log from '../../utils/log'
import STATUS from '../../utils/statusEnum'
import REGEX from '../../utils/regexEnum'

const load = (providers) => {
  log('info', 'core/lib/protocolProviders/rosstalk', 'Loaded protocol provider: Ross Video - Rosstalk')
  providers.push(descriptor)
}

class GenericRosstalk {
  constructor (_device) {
    this.device = _device
  }

  init = () => {
    this.socket = new net.Socket()
    this.socket.connect(this.device.configuration[1].value, this.device.configuration[0].value)
    this.socket.setKeepAlive(true, 0)

    this.socket.on('connect', () => {
      this.device.status = STATUS.OK
      log('info', `virtual/device/${this.device.id}`, 'Socket Connected')
    })

    this.socket.on('error', (error) => {
      log('error', 'core/lib/protocolProviders/rosstalk', error)
      this.device.status = STATUS.ERROR
    })

    this.socket.on('close', () => {
      this.device.status = STATUS.CLOSED
      switch (this.doNotRecreate) {
        case true:
          break
        case false:
          log('error', `virtual/device/${this.device.id}`, 'Socket Closed, Reconnecting in 10 Seconds')
          setTimeout(() => this.recreate(), 10000)
      }
    })
  }

  destroy = (callback) => {
    log('info', `virtual/device/${this.device.id}`, 'Destroying Instance')
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

  interface = (_action) => {
    switch (_action.providerFunction.id) {
      case 'message':
        this.socket.write(`${_action.parameters.find(parameter => parameter.id === 'message').value}\r`)
    }
  }
}

export { load, GenericRosstalk }

const descriptor = {
  id: 'rosstalk',
  type: 'protocol',
  label: 'Generic RossTalk',
  Construct: GenericRosstalk,
  parameters: [
    {
      required: true,
      id: 'host',
      label: 'Host',
      regex: REGEX.HOST
    },
    {
      required: true,
      id: 'port',
      label: 'Port',
      regex: REGEX.PORT
    }
  ],
  providerFunctions: [
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
}
