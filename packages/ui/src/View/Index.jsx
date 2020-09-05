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
import { Favorite20, Keyboard24, Settings24, TreeViewAlt24, User20, View32 } from '@carbon/icons-react'

import Bridges from './Bridges/Bridges.jsx'
import Contributers from './Contributers/Contributers.jsx'
import Controllers from './Controllers/Controllers.jsx'
import Core from './Core/Core.jsx'
import Clock from './components/Clock.jsx'
import Device from './Device/DeviceWrapper.jsx'
import Devices from './Devices/Devices.jsx'
import Flow from './Flow/Flow.jsx'
import GraphQLError from './components/GraphQLError.jsx'
import Login from './Login/Login.jsx'
import Logs from './Logs/Logs.jsx'
import NavLink from './components/NavLink.jsx'
import PanelWrapper from './Panels/PanelWrapper.jsx'
import Panels from './Panels/Panels.jsx'
import Shotbox from './Shotbox/Shotbox.jsx'
import ShotboxPanelWrapper from './Shotbox/ShotboxPanelWrapper.jsx'
import Stacks from './Stacks/Stacks.jsx'
import Status from './Status/Status.jsx'

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
                <HeaderNavigation aria-label="IBM [Platform]">
                  <HeaderMenu aria-label="Development Build" menuLinkName="This is a development build!">
                    <HeaderMenuItem href="https://phabricator.boreal.systems">Phabricator</HeaderMenuItem>
                    <HeaderMenuItem href="https://discord.gg/7kqpZRU">Discord</HeaderMenuItem>
                  </HeaderMenu>
                </HeaderNavigation>
                <HeaderGlobalBar>
                  { result.data &&
                    <HeaderGlobalAction aria-label="Clock" style={{ width: '10em', color: 'white' }}onClick={ () => {} }>
                      <TooltipDefinition
                        tooltipText="Time synced to Core"
                        align='center'
                        style={{ borderBottom: 'none' }}
                      >
                        <Clock tz={result.data.timezone} />
                      </TooltipDefinition>
                    </HeaderGlobalAction>
                  }
                  { isAuthenticated &&
                      <HeaderGlobalAction aria-label="User" onClick={() => { setAuthenticationState(false) }}>
                        <User20 />
                      </HeaderGlobalAction>
                  }
                  <HeaderGlobalAction aria-label="Contributers" onClick={ () => history.push({ pathname: '/contributers' }) }>
                    <Favorite20 />
                  </HeaderGlobalAction>
                </HeaderGlobalBar>
                { isAuthenticated && result.data && !useRouteMatch('/control/shotbox/:id') &&
                    <SideNav aria-label="Side navigation" isRail>
                      <SideNavItems>
                        <SideNavMenu renderIcon={View32} title='Monitor'>
                          <NavLink to="/monitor/status" label="Status"/>
                          <NavLink to="/monitor/bridges" label="Bridges"/>
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
                            <Route path="/monitor/status" component={Status} />
                            <Route path="/monitor/bridges" component={Bridges} />
                            <Route path="/monitor/logs" componrnt={Logs} />
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
                            <Route path="/contributers" component={Contributers} />
                            {/* REDIRECTS */}
                            <Route exact path="/">
                              <Redirect to="/monitor/status" />
                            </Route>
                            <Route exact path="/monitor">
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
      </div>
    )
  }
}

export default ControlPanel
