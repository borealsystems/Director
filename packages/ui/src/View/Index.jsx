import React, { useState } from 'react'

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from 'react-router-dom'

import { useQuery } from 'urql'

import {
  Content,
  Header,
  HeaderMenuButton,
  HeaderName,
  SkipToContent,
  SideNav,
  SideNavItems,
  SideNavMenu,
  HeaderContainer,
  HeaderGlobalBar,
  HeaderGlobalAction,
  Loading,
  Grid,
  Row,
  Column
} from 'carbon-components-react'

import { View32, Settings24, Keyboard24, User20, TreeViewAlt24, Switcher20 } from '@carbon/icons-react'

import NavLink from './components/NavLink.jsx'
import GraphQLError from './components/GraphQLError.jsx'

import Bridges from './Bridges/Bridges.jsx'
import Core from './Core/Core.jsx'
import Controllers from './Controllers/Controllers.jsx'
import Devices from './Devices/Devices.jsx'
import Device from './Device/DeviceWrapper.jsx'
import Flow from './Flow/Flow.jsx'
import Logs from './Logs/Logs.jsx'
import Login from './Login/Login.jsx'
import Panels from './Panels/Panels.jsx'
import Stacks from './Stacks/Stacks.jsx'
import Shotbox from './Shotbox/Shotbox.jsx'
import Status from './Status/Status.jsx'

const ControlPanel = () => {
  const [isAuthenticated, setAuthenticationState] = useState(true)

  const [result] = useQuery({
    query: `{ 
      coreConfig {
        label
      }
     }`
  })

  if (result.error) return <GraphQLError error={result.error} />
  if (!result.error) {
    return (
      <div className="container bx--container02">
        <Router>
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
                    { isAuthenticated &&
                      <HeaderGlobalAction aria-label="User" onClick={() => { setAuthenticationState(false) }}>
                        <User20 />
                      </HeaderGlobalAction>
                    }
                    <HeaderGlobalAction aria-label="Switcher" onClick={() => {}}>
                      <Switcher20 />
                    </HeaderGlobalAction>
                  </HeaderGlobalBar>
                  { isAuthenticated && result.data &&
                    <SideNav aria-label="Side navigation" isRail>
                      <SideNavItems>
                        <SideNavMenu renderIcon={View32} title='Monitor'>
                          <NavLink icon={View32} to="/monitor/status" label="Status"/>
                          <NavLink icon={View32} to="/monitor/bridges" label="Bridges"/>
                          <NavLink to="/monitor/logs" label="Logs"/>
                        </SideNavMenu>
                        <SideNavMenu renderIcon={Settings24} title="Configure">
                          <NavLink to="/config/devices" label="Devices"/>
                          <NavLink to="/config/stacks" label="Stacks"/>
                          <NavLink to="/config/panels" label="Panels"/>
                          <NavLink to="/config/controllers" label="Controllers"/>
                        </SideNavMenu>
                        <SideNavMenu renderIcon={Keyboard24} title="Control">
                          <NavLink to="/control/shotbox" label="Shotbox"/>
                        </SideNavMenu>
                        <SideNavMenu renderIcon={TreeViewAlt24} title="Core">
                          <NavLink to="/core/configure" label="Configuration"/>
                        </SideNavMenu>
                      </SideNavItems>
                    </SideNav>
                  }
                </Header>
                <Switch>
                  { result.loading && <Loading /> }
                  { !isAuthenticated && result.data &&
                    <>
                      <Redirect to="/login" />
                      <Login auth={setAuthenticationState}/>
                    </>
                  }
                  { isAuthenticated && result.data &&
                    <Content id="main-content">
                      <Grid>
                        <Row>
                          <Column lg={{ offset: 1, span: 10 }}>
                            {/* MONITOR */}
                            <Route exact path="/monitor">
                              <Redirect to="/monitor/status" />
                            </Route>
                            <Route path="/monitor/status">
                              <Status />
                            </Route>
                            <Route path="/monitor/bridges">
                              <Bridges />
                            </Route>
                            <Route path="/monitor/logs">
                              <Logs />
                            </Route>
                            {/* CONTROL */}
                            <Route path="/control/shotbox">
                              <Shotbox />
                            </Route>
                            <Route path="/control/flow">
                              <Flow />
                            </Route>
                            {/* CONFIGURE */}
                            <Route path="/config/devices" component={Devices} />
                            <Route path="/config/device/:id" component={Device} />
                            <Route path="/config/stacks" component={Stacks} />
                            <Route path="/config/panels" component={Panels} />
                            <Route path="/config/controllers" component={Controllers} />
                            {/* CORE */}
                            <Route path="/core/configure" component={Core} />
                            {/* ROOT */}
                            <Route exact path="/">
                              <Redirect to="/monitor/status" />
                            </Route>
                            <Route exact path="/login">
                              <Redirect to="/monitor/status" />
                            </Route>
                          </Column>
                        </Row>
                      </Grid>
                    </Content>
                  }
                </Switch>
              </>
            )}
          />
        </Router>
      </div>
    )
  }
}

export default ControlPanel
