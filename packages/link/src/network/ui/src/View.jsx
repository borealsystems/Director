import React, { useState, useContext } from 'react'
import { useQuery, useMutation } from 'urql'
import PropTypes from 'prop-types'

import {
  Column,
  Checkbox,
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

const ConnectionForm = ({ currentConnection, connectionMutation, refresh }) => {
  const [connection, setConnection] = useState(currentConnection)
  const [edited, setEdited] = useState({ host: false, port: false })

  const hostIsValid = () => {
    if (!edited.host && connection.host === (null || undefined)) {
      return true
    } else if (edited.host && connection.host === null) {
      return false
    } else if (connection.host.match(/(\b((25[0-5]|2[0-4]\d|[01]?\d{1,2}|\*)\.){3}(25[0-5]|2[0-4]\d|[01]?\d{1,2}|\*))|((([a-fA-F0-9]{1,4}|):){1,7}([a-fA-F0-9]{1,4}|:))|(^(?=^.{1,253}$)(([a-z\d]([a-z\d-]{0,62}[a-z\d])*[.]){1,3}[a-z]{1,61})$)/)) {
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

  const isSubmitable = (currentConnection.host || edited.host) && hostIsValid() && portIsValid()

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
        <Checkbox
          id='connectionHTTPSCheckbox'
          checked={connection.https}
          labelText='Connect via HTTPS'
          onClick={() => setConnection({ ...connection, https: !connection.https })}
        />
      </Row>
      <br/>
      <Row>
        <Button disabled={!isSubmitable} onClick={() => { connectionMutation({ connection: connection }).then(refresh()) }} size='default' kind='primary' style={{ width: '100%', maxWidth: '100%' }} renderIcon={ArrowRight20}>
          {currentConnection.status ? 'Update & Reconnect' : 'Connect' }
        </Button>
      </Row>
    </Column>
  )
}

ConnectionForm.propTypes = {
  currentConnection: PropTypes.object,
  connectionMutation: PropTypes.func,
  refresh: PropTypes.func
}

const View = () => {
  const { theme, toggleTheme } = useContext(globalContext)
  const [result, refresh] = useQuery({
    query: `{ 
      connection {
        host
        status
        https
      }
    }`
  })

  const [, connectionMutation] = useMutation(`mutation connectionMutation($connection: connectionInputType) {
    connection(connection: $connection) {
      host
      status
      https
    }
  }`)

  return (
    <HeaderContainer
      render={() => (
        <>
          <Header aria-label='BorealSystems Director'>
            <SkipToContent />
            <HeaderName onClick={() => history.push({ pathname: '/' })} prefix='Boreal Systems'>
              Director Link
            </HeaderName>
            <HeaderNavigation aria-label='Boreal Systems Director'>
              <HeaderMenu aria-label='Development Build' menuLinkName={'This is a development build'}>
                <HeaderMenuItem href='https://phabricator.boreal.systems'>Phabricator</HeaderMenuItem>
                <HeaderMenuItem href='https://discord.gg/7kqpZRU'>Discord</HeaderMenuItem>
              </HeaderMenu>
            </HeaderNavigation>
            <HeaderGlobalBar>
              <HeaderGlobalAction aria-label='Theme' onClick={() => { toggleTheme() }}>
                {theme === 'dx--light' ? <Light20 /> : <LightFilled20 />}
              </HeaderGlobalAction>
            </HeaderGlobalBar>
          </Header>
          <Content id='main-content'>
            { result.error && <GraphQLError error={result.error} />}
            { result.loading && <Loading /> }
            { result.data &&
              <Grid>
                <Row>
                  <ConnectionForm currentConnection={{ ...result.data.connection }} connectionMutation={connectionMutation} refresh={refresh}/>
                  <Column>
                    <img src={splash} width='75%' style={{ marginLeft: '25%', marginTop: '10%' }}/>
                  </Column>
                </Row>
              </Grid>
            }
          </Content>
        </>
      )}
    />
  )
}

export default View
