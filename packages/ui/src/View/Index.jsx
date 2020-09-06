import React, { useState } from 'react'
import {
  Redirect,
  Route,
  Switch,
  useHistory,
  useRouteMatch
} from 'react-router-dom'

import { useQuery } from 'urql'

import {
  Column,
  Content,
  Grid,
  Header,
  HeaderContainer,
  HeaderGlobalAction,
  HeaderGlobalBar,
  HeaderMenu,
  HeaderMenuButton,
  HeaderMenuItem,
  HeaderName,
  HeaderNavigation,
  Loading,
  Row,
  SideNav,
  SideNavItems,
  SideNavMenu,
  SkipToContent,
  TooltipDefinition
} from 'carbon-components-react'
import { Keyboard24, Settings24, TreeViewAlt24, User20, View32 } from '@carbon/icons-react'

import Controllers from './Controllers/Controllers.jsx'
import Core from './Core/Core.jsx'
import Clock from './components/Clock.jsx'
import Dashboard from './Dashboard/Dashboard.jsx'
import Device from './Device/DeviceWrapper.jsx'
import Devices from './Devices/Devices.jsx'
import Flow from './Flow/Flow.jsx'
import GraphQLError from './components/GraphQLError.jsx'
import Login from './Login/Login.jsx'
import PanelWrapper from './Panels/PanelWrapper.jsx'
import Panels from './Panels/Panels.jsx'
import Shotbox from './Shotbox/Shotbox.jsx'
import ShotboxPanelWrapper from './Shotbox/ShotboxPanelWrapper.jsx'
import SideNavMenuItem from './components/SideNavMenuItem.jsx'
import SideNavLink from './components/SideNavLink.jsx'
import Stacks from './Stacks/Stacks.jsx'

const ControlPanel = () => {
  const [isAuthenticated, setAuthenticationState] = useState(true)

  const history = useHistory()

  const [result] = useQuery({
    query: `{ 
      coreConfig {
        label
        timezone
      }
     }`
  })

  if (result.error) return <GraphQLError error={result.error} />
  if (!result.error) {
    return (
      <div className="container bx--container02">
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
                <HeaderName onClick={() => history.push({ pathname: '/' })} prefix='BorealSystems'>
                    Director
                </HeaderName>
                <HeaderNavigation aria-label="BorealSystems Director">
                  { result.data &&
                    <HeaderMenu aria-label="Development Build" menuLinkName={`This is a development build on ${result.data.coreConfig.label}`}>
                      <HeaderMenuItem href="https://phabricator.boreal.systems">Phabricator</HeaderMenuItem>
                      <HeaderMenuItem href="https://discord.gg/7kqpZRU">Discord</HeaderMenuItem>
                    </HeaderMenu>
                  }
                </HeaderNavigation>
                <HeaderGlobalBar>
                  { result.data &&
                    <HeaderGlobalAction aria-label="Clock" style={{ width: '10em' }} onClick={ () => {} }>
                      <TooltipDefinition
                        tooltipText="Time synced to Core"
                        align='center'
                        style={{ borderBottom: 'none' }}
                      >
                        <Clock tz={result.data.timezone} style={{ borderBottom: 'none' }} />
                      </TooltipDefinition>
                    </HeaderGlobalAction>
                  }
                  { isAuthenticated &&
                      <HeaderGlobalAction aria-label="User" onClick={() => { setAuthenticationState(false) }}>
                        <User20 />
                      </HeaderGlobalAction>
                  }
                </HeaderGlobalBar>
                { isAuthenticated && result.data && !useRouteMatch('/control/shotbox/:id') &&
                    <SideNav aria-label="Side navigation" isRail>
                      <SideNavItems>
                        <SideNavLink to="/dashboard" label="Dashboard" renderIcon={View32} />
                        <SideNavMenu renderIcon={Settings24} title="Configure">
                          <SideNavMenuItem to="/config/devices" label="Devices"/>
                          <SideNavMenuItem to="/config/stacks" label="Stacks"/>
                          <SideNavMenuItem to="/config/panels" label="Panels"/>
                          <SideNavMenuItem to="/config/controllers" label="Controllers"/>
                        </SideNavMenu>
                        <SideNavMenu renderIcon={Keyboard24} title="Control">
                          <SideNavMenuItem to="/control/shotbox" label="Shotbox"/>
                        </SideNavMenu>
                        <SideNavMenu renderIcon={TreeViewAlt24} title="Core">
                          <SideNavMenuItem to="/core/configure" label="Configuration"/>
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
                      <Grid style={{ maxWidth: useRouteMatch('/dashboard') ? '200rem' : '90rem' }}>
                        <Row>
                          <Column>
                            {/* MONITOR */}
                            <Route path="/dashboard" component={Dashboard} />
                            {/* CONFIGURE */}
                            <Route exact path="/config/devices" component={Devices} />
                            <Route path="/config/devices/:id" component={Device} />
                            <Route exact path="/config/stacks" component={Stacks} />
                            <Route exact path="/config/panels" component={Panels} />
                            <Route path="/config/panels/:id" component={PanelWrapper} />
                            <Route path="/config/controllers" component={Controllers} />
                            {/* CONTROL */}
                            <Route exact path="/control/shotbox" component={Shotbox} />
                            <Route path="/control/shotbox/:id" component={ShotboxPanelWrapper} />
                            <Route path="/control/flow" component={Flow} />
                            {/* CORE */}
                            <Route path="/core/configure" component={Core} />
                            {/* REDIRECTS */}
                            <Route exact path="/">
                              <Redirect to="/dashboard" />
                            </Route>
                            <Route exact path="/login">
                              <Redirect to="/dashboard" />
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
      </div>
    )
  }
}

export default ControlPanel
