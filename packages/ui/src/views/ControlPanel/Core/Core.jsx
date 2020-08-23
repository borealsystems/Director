import React, { useState } from 'react'
import { useQuery, useMutation } from 'urql'
import { Button, InlineLoading, TextInput, Checkbox, Tooltip } from 'carbon-components-react'
import GraphQLError from '../components/GraphQLError.jsx'

const Core = () => {
  const [result] = useQuery({
    query: `{ 
      coreConfig {
        label
        port
        address
        mdns
      }
     }`
  })

  const [coreConfig, setCoreConfig] = useState({})

  const coreConfigUpdateMutaionGQL = `
    mutation coreConfig($config: coreConfigInputType) {
      coreConfig(config:$config) {
        label
        port
        address
        mdns
      }
    }`

  const [coreConfigUpdateMutationResult, coreConfigUpdateMutation] = useMutation(coreConfigUpdateMutaionGQL)
  const updateCoreConfiguration = () => {
    coreConfigUpdateMutation({ config: coreConfig }).then(() => console.log(coreConfigUpdateMutationResult))
    if (coreConfig.port.toString() !== window.location.port) {
      setTimeout(() => {
        window.location.replace(`${window.location.protocol}//${window.location.hostname}:${coreConfig.listen}/core/configure`)
      }, 500)
    }
  }

  if (result.error) {
    return (
      <div>
        <h1
          style={{
            margin: '0 0 32px 0'
          }}
        >
          Core Configuration
        </h1>
        <GraphQLError caption={result.error.message} />
      </div>
    )
  }
  if (result.fetching) {
    return (
      <div>
        <h1
          style={{
            margin: '0 0 32px 0'
          }}
        >
        Core Configuration
        </h1>
        <InlineLoading />
      </div>
    )
  }
  if (result.data && !coreConfig.port) {
    setCoreConfig(result.data.coreConfig)
    return (
      <div>
        <h1
          style={{
            margin: '0 0 32px 0'
          }}
        >
        Core Configuration
        </h1>
        <InlineLoading />
      </div>
    )
  }

  if (result.data && coreConfig.port) {
    return (
      <div>
        <h1
          style={{
            margin: '0 0 32px 0'
          }}
        >
        Core Configuration
        </h1>
        <fieldset className={'bx--fieldset'}>
          <legend className={'$bx--label'}>General</legend> <br/>
          <div className="bx--row">
            <div className="bx--text-input__field-wrapper bx--col">
              <TextInput
                type='text'
                id='coreLabel'
                placeholder='Required'
                value={coreConfig.label}
                labelText='Core Name'
                onClick={() => {}}
                onChange={(e) => { setCoreConfig({ ...coreConfig, label: e.target.value }) }}
              />
            </div>
          </div>
        </fieldset>
        <fieldset className={'bx--fieldset'}>
          <legend className={'$bx--label'}>Networking</legend> <br/>
          <div className="bx--row">
            <div className="bx--text-input__field-wrapper bx--col">
              <TextInput
                type='text'
                id='coreListenPort'
                disabled
                placeholder='Required'
                value={coreConfig.port}
                labelText='Core Listen Port'
                onClick={() => {}}
                onChange={(e) => { setCoreConfig({ ...coreConfig, port: e.target.value }) }}
              />
            </div>
          </div><br/>
          <div className="bx--row">
            <div className="bx--text-input__field-wrapper bx--col">
              <Checkbox
                id="coreConfigMDNS"
                disabled
                labelText='Enable mDNS'
                checked={coreConfig.mdns}
                onChange={() => setCoreConfig({ ...coreConfig, mdns: !coreConfig.mdns })}
              />
              <Tooltip>
                <p>
                  mDNS is used for Link and Director service discovery. Disabling this will stop Link and other Director instance from autodiscovering each other, but will aid in administration in large networks.
                </p>
              </Tooltip>
            </div>
          </div><br/>
        </fieldset>
        <Button onClick={() => { updateCoreConfiguration() }} size='default' kind="primary">
          Update
        </Button>
      </div>
    )
  }
}

export default Core
