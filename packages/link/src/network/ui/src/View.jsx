import React, { useState, useContext } from 'react'
import { useQuery, useMutation } from 'urql'
import PropTypes from 'prop-types'

import {
  Column,
  Content,
  Grid,
  Header,
  HeaderContainer,
  HeaderGlobalAction,
  HeaderGlobalBar,
  HeaderMenu,
  HeaderMenuItem,
  HeaderName,
  HeaderNavigation,
  Loading,
  Row,
  SkipToContent,
  TextInput,
  Button
} from 'carbon-components-react'

import { Light20, LightFilled20, ArrowRight20 } from '@carbon/icons-react'

import splash from './connected_world.svg'

import globalContext from './globalContext'
import GraphQLError from './GraphQLError.jsx'

import './index.scss'

const ConnectionForm = ({ currentConnection, connectionMutation, setPause }) => {
  const [connection, setConnection] = useState(currentConnection)
  const [edited, setEdited] = useState({ host: false, port: false })

  const hostIsValid = () => {
    if (!edited.host && connection.host === (null || undefined)) {
      return true
    } else if (edited.host && connection.host === null) {
      return false
    } else if (connection.host.match(/\b((([0-2]\d[0-5])|(\d{2})|(\d))\.){3}(([0-2]\d[0-5])|(\d{2})|(\d))\b/g)) {
      return true
    } else if (connection.host.match(/(([a-fA-F0-9]{1,4}|):){1,7}([a-fA-F0-9]{1,4}|:)/gm)) {
      return true
    } else if (connection.host.match(/^(?=^.{1,253}$)(([a-z\d]([a-z\d-]{0,62}[a-z\d])*[.]){1,3}[a-z]{1,61})$/gm)) {
      return true
    } else return false
  }

  const portIsValid = () => {
    if (!edited.port && connection.port === (null || undefined)) {
      return true
    } else if (edited.port && connection.port === null) {
      return false
    } else if (connection.port.match(/^([0-9]{1,4}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5])$/)) {
      return true
    }
  }

  const isSubmitable = (currentConnection.host || edited.host) && (currentConnection.port || edited.port) && hostIsValid() && portIsValid()

  return (
    <Column sm={{ span: 1 }}>
      <br/><br/><br/>
      <Row>
        <h2>{currentConnection.status ? 'Connected' : 'Connect'} To Core</h2>
      </Row>
      <br/>
      <Row>
        <TextInput
          type='text'
          id='host'
          placeholder='director.boreal.systems'
          value={connection.host || ''}
          labelText='Host'
          onChange={(e) => {
            setConnection({ ...connection, host: e.target.value })
            setEdited({ ...edited, host: true })
          }}
          invalid={!hostIsValid()}
          invalidText='Please enter a valid IPv4, IPv6, or FQDN'
        />
      </Row>
      <br/>
      <Row>
        <TextInput
          type='text'
          id='port'
          placeholder='3000'
          value={connection.port || ''}
          labelText='Port'
          onChange={(e) => {
            setConnection({ ...connection, port: e.target.value })
            setEdited({ ...edited, port: true })
          }}
          invalid={!portIsValid()}
          invalidText='Please enter a valid port'
        />
      </Row>
      <br/><br/>
      <Row>
        <Button disabled={!isSubmitable} onClick={() => { connectionMutation({ connection: connection }) }} size='default' kind="primary" style={{ width: '100%', maxWidth: '100%' }} renderIcon={ArrowRight20}>
          {currentConnection.status ? 'Update & Reconnect' : 'Connect' }
        </Button>
      </Row>
    </Column>
  )
}

ConnectionForm.propTypes = {
  currentConnection: PropTypes.object,
  connectionMutation: PropTypes.func,
  setPause: PropTypes.func
}

const View = () => {
  const { theme, toggleTheme } = useContext(globalContext)
  const [pause, setPause] = useState(false)
  const [result] = useQuery({
    query: `{ 
      connection {
        host
        port
        status
      }
    }`,
    pollInterval: 10000,
    pause: pause
  })

  const [, connectionMutation] = useMutation(`mutation connectionMutation($connection: connectionInputType) {
    connection(connection: $connection) {
      host
      port
      status
    }
  }`)

  if (result.error) return <GraphQLError error={result.error} />
  if (result.fetching) return <Loading />
  if (result.data) {
    if (pause === false && result.data.connection && result.data.connection.status === false) setPause(true)
    if (pause === true && result.data.connection && result.data.connection.status === true) setPause(false)
    return (
      <HeaderContainer
        render={() => (
          <>
            <Header aria-label="BorealSystems Director">
              <SkipToContent />
              <HeaderName onClick={() => history.push({ pathname: '/' })} prefix='Boreal Systems'>
                Director Link
              </HeaderName>
              <HeaderNavigation aria-label="Boreal Systems Director">
                <HeaderMenu aria-label="Development Build" menuLinkName={'This is a development build'}>
                  <HeaderMenuItem href="https://phabricator.boreal.systems">Phabricator</HeaderMenuItem>
                  <HeaderMenuItem href="https://discord.gg/7kqpZRU">Discord</HeaderMenuItem>
                </HeaderMenu>
              </HeaderNavigation>
              <HeaderGlobalBar>
                <HeaderGlobalAction aria-label="Theme" onClick={() => { toggleTheme() }}>
                  {theme === 'dx--light' ? <Light20 /> : <LightFilled20 />}
                </HeaderGlobalAction>
              </HeaderGlobalBar>
            </Header>
            <Content id="main-content">
              <Grid>
                <Row>
                  <ConnectionForm currentConnection={{ ...result.data.connection }} connectionMutation={connectionMutation} setPause={setPause}/>
                  <Column>
                    <img src={splash} width='75%' style={{ marginLeft: '25%', marginTop: '10%' }}/>
                  </Column>
                </Row>
              </Grid>
            </Content>
          </>
        )}
      />
    )
  }
}

export default View
