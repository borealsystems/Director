import React, { useState } from 'react'
import { useQuery, useMutation } from 'urql'
import { Button, Form, InlineLoading, TextInput, Grid, Row, Column } from 'carbon-components-react'
import GraphQLError from '../components/GraphQLError.jsx'

const Core = ({ updateAndSetRealm }) => {
  const [result] = useQuery({
    query: `{ 
      cores {
        label
        id
        helpdeskURI
        helpdeskVisable
      }
      thisCore {
        id
        label
      }
     }`,
    pollInterval: 10000
  })

  const [coreConfig, setCoreConfig] = useState({})

  const coreMutationGQL = `
  mutation core($core: coreInputType) {
    core(core: $core) {
      id
    }
  }`

  const [, coreMutation] = useMutation(coreMutationGQL)

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
  if (result.data && !coreConfig.id) {
    setCoreConfig(result.data.cores.find(core => core.id === result.data.thisCore.id))
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

  if (result.data) {
    return (
      <Grid>
        <Form>
          <Row>
            <Column>
              <h2>System Configuration</h2>
            </Column>
          </Row>
          <br/>
          <Row>
            <Column>
              <legend>Core</legend>
            </Column>
          </Row><br/>
          <Row>
            <Column>
              <TextInput
                type='text'
                id='coreID'
                value={coreConfig.id}
                labelText='Core ID'
                disabled
              />
            </Column>
            <Column>
              <TextInput
                type='text'
                id='coreLabel'
                placeholder='Core'
                value={coreConfig.label}
                labelText='Core Name'
                required
                onChange={(e) => { setCoreConfig({ ...coreConfig, label: e.target.value }) }}
              />
            </Column>
          </Row><br/>
          {/* THIS IS FOR AUTHENTICATION WHEN IT EXISTS */}
          {/* <Row>
            <Column>
              <legend>Log In Page</legend>
            </Column>
          </Row> <br/>
          <Row>
            <Column>
              <TextInput
                type='url'
                id='coreLoginHelpdeskURI'
                placeholder='https://phabricator.boreal.systems'
                value={coreConfig.helpdeskURI ?? ''}
                labelText='Helpdesk Link'
                required={coreConfig.helpdeskVisable}
                invalidText='We can&apos;t show a link that doesnt exist'
                invalid={coreConfig.helpdeskVisable && !coreConfig.helpdeskURI}
                onChange={(e) => { setCoreConfig({ ...coreConfig, helpdeskURI: e.target.value }) }}
              />
            </Column>
            <Column style={{ marginTop: '1em' }}>
              <Toggle
                id='coreLoginHelpdeskVisableToggle'
                defaultToggled={coreConfig.helpdeskVisable}
                labelA='Link Hidden'
                labelB='Link Visible'
                value={coreConfig.helpdeskVisable}
                onChange={() => setCoreConfig({ ...coreConfig, helpdeskVisable: !coreConfig.helpdeskVisable })}
              />
            </Column>
          </Row><br/> */}
          <Row>
            <Column>
              <Button
                size='default'
                kind='primary'
                onClick={() => {
                  coreMutation({ core: coreConfig })
                    .then(() => updateAndSetRealm({ core: { id: coreConfig.id, label: coreConfig.label } }))
                }}>
                Update
              </Button>
            </Column>
          </Row>
        </Form>
      </Grid>
    )
  }
}

export default Core
