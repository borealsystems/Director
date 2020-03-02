import { oscInit } from './osc'

const _regex = {
  host: '(^((?:([a-z0-9]\\.|[a-z0-9][a-z0-9\\-]{0,61}[a-z0-9])\\.)+)([a-z0-9]{2,63}|(?:[a-z0-9][a-z0-9\\-]{0,61}[a-z0-9]))\\.?$)|(\b(?:(?:2(?:[0-4][0-9]|5[0-5])|[0-1]?[0-9]?[0-9])\\.){3}(?:(?:2([0-4][0-9]|5 [0-5])|[0-1]?[0-9]?[0-9]))\\b)',
  port: '^([0-9]{1,4}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5])$',
  signed_int: '^-?\\d+$',
  signed_float: '([+-]?(?=\\.\\d|\\d)(?:\\d+)?(?:\\.?\\d*))(?:[eE]([+-]?\\d+))?'
}
const providers = [
  {
    id: 'osc',
    label: 'Generic OSC',
    protocol: 'OSC',
    parameters: [
      {
        required: true,
        id: 'host',
        label: 'Host',
        regex: _regex.host
      },
      {
        required: true,
        id: 'port',
        label: 'Port',
        regex: _regex.port
      }
    ],
    providerFunctions: [
      {
        id: 'integer',
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
            regex: _regex.signed_int
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
            regex: _regex.signed_int
          }
        ]
      },
      {
        id: 'float',
        label: 'Send Float',
        parameters: [
          {
            type: 'textInput',
            label: 'OSC Path',
            id: 'path'
          },
          {
            type: 'textInput',
            label: 'Value',
            id: 'float',
            regex: _regex.signed_float
          }
        ]
      }
    ]
  }
]

const initProviders = () => {
  providers.map((provider, index) => {
    switch (provider.id) {
      case 'osc':
        oscInit(provider)
    }
  })
}

export { initProviders, providers }
