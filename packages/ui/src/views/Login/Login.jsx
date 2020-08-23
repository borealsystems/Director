import React from 'react'

import { useQuery } from 'urql'

import {
  Content,
  Header,
  HeaderMenuButton,
  HeaderName,
  SkipToContent,
  HeaderContainer,
  HeaderGlobalBar,
  HeaderGlobalAction,
  Loading,
  TextInput,
  Button,
  Checkbox,
  Grid,
  Row,
  Column
} from 'carbon-components-react'

import { Switcher20, ArrowRight20 } from '@carbon/icons-react'

import GraphQLError from '../ControlPanel/components/GraphQLError.jsx'

import background from './undraw_Outer_space_drqu.svg'

const Login = (props) => {
  const [result] = useQuery({
    query: `{ 
      coreConfig {
        label
      }
     }`
  })

  if (result.error) { return (<GraphQLError caption={result.error.message} />) }
  if (result.fetching) { return (<Loading />) }
  if (result.data) {
    return (
      <div className="container" style={{ backgroundColour: '#222222' }}>
        <HeaderContainer
          render={({ isSideNavExpanded, onClickSideNavExpand }) => (
            <>
              <Header aria-label="BorealSystems Director">
                <SkipToContent />
                <HeaderMenuButton
                  aria-label="Open menu"
                  onClick={onClickSideNavExpand}
                  isActive={isSideNavExpanded}
                />
                <HeaderName href="/" prefix='BorealSystems'>
                  Director
                </HeaderName>
                <HeaderGlobalBar>
                  <HeaderGlobalAction aria-label="Switcher" onClick={() => {}}>
                    <Switcher20 />
                  </HeaderGlobalAction>
                </HeaderGlobalBar>
              </Header>
              <Content id="main-content">
                <Grid>
                  <Row>
                    <Column sm={{ span: 1 }}>
                      <Row>
                        <h2>Log in</h2>
                      </Row>
                      <br/>
                      <Row>
                        <TextInput
                          type='text'
                          id='username'
                          placeholder='user@boreal.systems'
                          // value={device.label}
                          labelText='Username'
                          onClick={() => {}}
                        // onChange={(e) => { setDevice({ ...device, label: e.target.value }) }}
                        />
                      </Row>
                      <br/>
                      <Row>
                        <TextInput
                          type='password'
                          id='password'
                          placeholder='••••••••••'
                          // value={device.location || undefined}
                          labelText='Password'
                          onClick={() => {}}
                        // onChange={(e) => { setDevice({ ...device, location: e.target.value }) }}
                        />
                      </Row>
                      <br/>
                      <Row>
                        <Button onClick={() => { props.auth(true) }} size='default' kind="primary" style={{ width: '100%', maxWidth: '100%' }} renderIcon={ArrowRight20}>
                        Continue
                        </Button>
                      </Row>
                      <br/>
                      <Row>
                        <Checkbox onChange={() => { }} labelText='Remember Me' />
                      </Row>
                    </Column>
                    <Column>
                      <img src={background} width='75%' style={{ marginLeft: '15%', marginTop: '10%' }}/>
                    </Column>
                  </Row>
                </Grid>
              </Content>
            </>
          )}
        />
      </div>
    )
  }
}

export default Login
