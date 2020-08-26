import React, { useState } from 'react'
import { useQuery, useMutation } from 'urql'
import { Button, InlineLoading, TextInput, Checkbox, Tooltip, Grid, Row, Column, InlineNotification } from 'carbon-components-react'
import GraphQLError from '../components/GraphQLError.jsx'

const Core = () => {
  const [result] = useQuery({
    query: `{ 
      coreConfig {
        label
        port
        address
        mdns
        helpdeskURI
        helpdeskVisable
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
        helpdeskURI
        helpdeskVisable
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
        <GraphQLError error={result.error} />
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
      <Grid>
        <Row>
          <InlineNotification
            style={{ width: '100%' }}
            lowContrast={true}
            kind='warning'
            title='This interface is being overhauled'
            subtitle='Items may move and/or break in the near future, please report bugs to Phabricator T96'
            hideCloseButton={true}
          />
        </Row>
        <Row>
          <h1>Core Configuration</h1>
        </Row>
        <br/>
        <Row>
          <Column>
            <fieldset>
              <legend>General</legend> <br/>
              <TextInput
                type='text'
                id='coreLabel'
                placeholder='Required'
                value={coreConfig.label}
                labelText='Core Name'
                onClick={() => {}}
                onChange={(e) => { setCoreConfig({ ...coreConfig, label: e.target.value }) }}
              />
            </fieldset>
          </Column>
        </Row><br/>
        <Row>
          <Column>
            <legend>Networking</legend>
          </Column>
        </Row> <br/>
        <Row>
          <Column>
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
          </Column>
        </Row>
        <Row>
          <Column>
            <Checkbox
              id="coreConfigMDNS"
              disabled
              labelText='Enable mDNS'
              checked={coreConfig.mdns}
              onChange={() => setCoreConfig({ ...coreConfig, mdns: !coreConfig.mdns })}
            />
          </Column>
          <Column>
            <Tooltip>
              <p>
              mDNS is used for Link and Director service discovery. Disabling this will stop Link and other Director instance from autodiscovering each other, but will aid in administration in large networks.
              </p>
            </Tooltip>
          </Column>
        </Row>
        <Row>
          <Column>
            <legend>Log In Page</legend>
          </Column>
        </Row> <br/>
        <Row>
          <Column>
            <TextInput
              type='text'
              id='coreLoginHelpdeskURI'
              placeholder='Required'
              value={coreConfig.helpdeskURI}
              labelText='Helpdesk URI'
              onClick={() => {}}
              onChange={(e) => { setCoreConfig({ ...coreConfig, helpdeskURI: e.target.value }) }}
            />
          </Column>
        </Row>
        <Row>
          <Column>
            <Checkbox
              id="coreLoginHelpdeskVisable"
              labelText='Show Helpdesk Link'
              checked={coreConfig.helpdeskVisable}
              onChange={() => setCoreConfig({ ...coreConfig, helpdeskVisable: !coreConfig.helpdeskVisable })}
            />
          </Column>
        </Row>
        <Row>
          <Column>
            <Button onClick={() => {
              console.log(coreConfig)
              updateCoreConfiguration()
            }} size='default' kind="primary">
              Update
            </Button>
          </Column>
        </Row>
      </Grid>
    )
  }
}

export default Core
