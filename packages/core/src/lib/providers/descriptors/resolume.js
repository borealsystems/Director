import osc from './osc'

const resolume = () => {}

const regexClasses = {
  host: '(^((?:([a-z0-9]\\.|[a-z0-9][a-z0-9\\-]{0,61}[a-z0-9])\\.)+)([a-z0-9]{2,63}|(?:[a-z0-9][a-z0-9\\-]{0,61}[a-z0-9]))\\.?$)|(\b(?:(?:2(?:[0-4][0-9]|5[0-5])|[0-1]?[0-9]?[0-9])\\.){3}(?:(?:2([0-4][0-9]|5 [0-5])|[0-1]?[0-9]?[0-9]))\\b)',
  port: '^([0-9]{1,4}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5])$',
  signed_int: '^-?\\d+$',
  signed_float: '([+-]?(?=\\.\\d|\\d)(?:\\d+)?(?:\\.?\\d*))(?:[eE]([+-]?\\d+))?'
}

resolume.init = (providers, providerInterfaces) => {
  providers.push(resolume.descriptor)
  providerInterfaces.push({ id: 'resolume', providerInterface: resolume.interface })
}

resolume.descriptor = {
  id: 'resolume',
  label: 'Resolume Arena',
  protocol: 'resolume',
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
      id: 'column',
      label: 'Connect Column',
      parameters: [
        {
          inputType: 'textInput',
          label: 'Column',
          id: 'column'
        }
      ]
    }
  ]
}

resolume.interface = (deviceConfig, functionID, actionParameters) => {
  switch (functionID) {
    case 'column':
      osc.rawInterface(
        deviceConfig.find((parameter) => { return parameter.id === 'host' }).value,
        deviceConfig.find((parameter) => { return parameter.id === 'port' }).value,
        `/composition/columns/${actionParameters.find((parameter) => { return parameter.id === 'column' }).value}/connect`,
        [
          {
            type: 'i',
            value: 1
          }
        ]
      )
      break
  }
}

export default resolume
