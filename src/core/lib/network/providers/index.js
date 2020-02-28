const providers = [
  {
    id: 'genericOSC',
    label: 'Generic OSC',
    protocol: 'OSC',
    parameters: [
      {
        required: true,
        id: 'host',
        label: 'Host',
        regex: '(^((?:([a-z0-9]\\.|[a-z0-9][a-z0-9\\-]{0,61}[a-z0-9])\\.)+)([a-z0-9]{2,63}|(?:[a-z0-9][a-z0-9\\-]{0,61}[a-z0-9]))\\.?$)|(\b(?:(?:2(?:[0-4][0-9]|5[0-5])|[0-1]?[0-9]?[0-9])\\.){3}(?:(?:2([0-4][0-9]|5 [0-5])|[0-1]?[0-9]?[0-9]))\\b)'
      },
      {
        required: true,
        id: 'port',
        label: 'Port',
        regex: '^([0-9]{1,4}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5])$'
      }
    ]
  }
]

export { providers }
