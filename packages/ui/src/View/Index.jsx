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
import NavGroup from './components/NavGroup.jsx'
import GraphQLError from './components/GraphQLError.jsx'

import Bridges from './Bridges/Bridges.jsx'
import Core from './Core/Core.jsx'
import Controllers from './Controllers/Controllers.jsx'
import Devices from './Devices/Devices.jsx'
import Flow from './Flow/Flow.jsx'
import Logs from './Logs/Logs.jsx'
import Login from './Login/Login.jsx'
import Panels from './Panels/Panels.jsx'
import Stacks from './Stacks/Stacks.jsx'
import Shotbox from './Shotbox/Shotbox.jsx'
import Status from './Status/Status.jsx'

const ControlPanel = () => {
  const [isAuthenticated, setAuthenticationState] = useState(false)

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
      <div className="container">
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
                    <SideNav aria-label="Side navigation" expanded={isSideNavExpanded}>
                      <SideNavItems>
                        <NavGroup icon={View32} label="Monitor" grouppath="/monitor">
                          <NavLink to="/monitor/status" label="Status"/>
                          <NavLink to="/monitor/bridges" label="Bridges"/>
                          <NavLink to="/monitor/logs" label="Logs"/>
                        </NavGroup>
                        <NavGroup icon={Settings24} label="Configure" grouppath="/config">
                          <NavLink to="/config/devices" label="Devices"/>
                          <NavLink to="/config/stacks" label="Stacks"/>
                          <NavLink to="/config/panels" label="Panels"/>
                          <NavLink to="/config/controllers" label="Controllers"/>
                        </NavGroup>
                        <NavGroup icon={Keyboard24} label="Control" grouppath="/control">
                          <NavLink to="/control/shotbox" label="Shotbox"/>
                        </NavGroup>
                        <NavGroup icon={TreeViewAlt24} label="Core" grouppath="/core">
                          <NavLink to="/core/configure" label="Configuration"/>
                        </NavGroup>
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
                            <Route path="/config/devices">
                              <Devices />
                            </Route>
                            <Route path="/config/stacks">
                              <Stacks />
                            </Route>
                            <Route path="/config/panels">
                              <Panels />
                            </Route>
                            <Route path="/config/controllers">
                              <Controllers />
                            </Route>
                            {/* CORE */}
                            <Route path="/core/configure">
                              <Core />
                            </Route>
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
