import React, { useState, useContext, lazy, Suspense } from 'react'
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
  ComboBox,
  ErrorBoundary,
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
  SkipToContent
} from 'carbon-components-react'

import globalContext from '../globalContext'
import './index.scss'

import Clock from './components/Clock.jsx'
import SideNavMenuItem from './components/SideNavMenuItem.jsx'
import SideNavLink from './components/SideNavLink.jsx'
import ReactError from './components/ReactError.jsx'
import GraphQLError from './components/GraphQLError.jsx'
import { Keyboard24, Light20, LightFilled20, Settings24, TreeViewAlt24, User20, View32 } from '@carbon/icons-react'

const Landing = lazy(() => import('./Landing/Landing.jsx'))
const Login = lazy(() => import('./Login/Login.jsx'))

const Controllers = lazy(() => import('./Controllers/Controllers.jsx'))
const Core = lazy(() => import('./Core/Core.jsx'))
const Dashboard = lazy(() => import('./Dashboard/Dashboard.jsx'))
const Device = lazy(() => import('./Device/DeviceWrapper.jsx'))
const Devices = lazy(() => import('./Devices/Devices.jsx'))
const Flow = lazy(() => import('./Flow/Flow.jsx'))
const PanelWrapper = lazy(() => import('./Panels/PanelWrapper.jsx'))
const Panels = lazy(() => import('./Panels/Panels.jsx'))
const Realms = lazy(() => import('./Realms/Realms.jsx'))
const Shotbox = lazy(() => import('./Shotbox/Shotbox.jsx'))
const ShotboxPanelWrapper = lazy(() => import('./Shotbox/ShotboxPanelWrapper.jsx'))
const Stacks = lazy(() => import('./Stacks/Stacks.jsx'))
const StackWrapper = lazy(() => import('./Stacks/StackWrapper.jsx'))

const BorealDirector = () => {
  const [isAuthenticated, setAuthenticationState] = useState(true)
  const { contextRealm, setContextRealm, theme, toggleTheme } = useContext(globalContext)

  const history = useHistory()

  const [result, reexecuteRealmsQuery] = useQuery({
    query: `{ 
      cores {
        id
        label
        timezone
      }
      thisCore {
        id
        label
      }
      realms {
        id
        label
        description
        coreID
        coreLabel
      }
     }`
  })

  const matchShotbox = useRouteMatch('/cores/:core/realms/:realm/control/shotbox/:id')
  const matchRoot = useRouteMatch({ path: '/', exact: true })
  const matchDashboard = useRouteMatch({ path: '/cores/:core/realms/:realm/', exact: true, strict: true })

  const showSidebar = isAuthenticated && result.data && !matchShotbox && !matchRoot && contextRealm.coreID
  const fullWidth = matchDashboard || matchRoot
  const showTopRealmSelect = contextRealm.id && result.data?.realms.length > 0 && !matchRoot && !matchShotbox
  const disableTopRealmSelect = useRouteMatch({ path: '/cores/:core/realms', exact: true, strict: true })

  const updateAndSetRealm = realmUpdate => {
    reexecuteRealmsQuery()
    setContextRealm({ ...contextRealm, ...realmUpdate })
  }

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
                <HeaderName onClick={() => history.push({ pathname: `/cores/${contextRealm.coreID}/realms/${contextRealm.id}/` })} prefix='Boreal Systems'>
                  Director
                </HeaderName>
                <HeaderNavigation aria-label="Boreal Systems Director">
                  { showTopRealmSelect &&
                    <ComboBox
                      className='coreSelect'
                      ariaLabel="Dropdown"
                      id="panel"
                      label='Select a panel'
                      placeholder='Core'
                      disabled={!!disableTopRealmSelect}
                      selectedItem={contextRealm}
                      items={result.data.realms}
                      itemToString={(item) => { return item.id === 'ROOT' ? item.coreLabel : `${item.coreLabel} / ${item.label}` }}
                      onChange={(event) => { setContextRealm(event.selectedItem) }}
                    />
                  }
                  <HeaderMenu aria-label="Development Build" menuLinkName={'This is a development build'}>
                    <HeaderMenuItem href="https://phabricator.boreal.systems">Phabricator</HeaderMenuItem>
                    <HeaderMenuItem href="https://discord.gg/7kqpZRU">Discord</HeaderMenuItem>
                  </HeaderMenu>
                </HeaderNavigation>
                <HeaderGlobalBar>
                  { result.data &&
                      <Clock tz={result.data.cores[0].timezone} />
                  }
                  { isAuthenticated &&
                    <>
                      <HeaderGlobalAction aria-label="Theme" onClick={() => { toggleTheme() }}>
                        {theme === 'light' ? <Light20 /> : <LightFilled20 />}
                      </HeaderGlobalAction>
                      <HeaderGlobalAction aria-label="User" onClick={() => { setAuthenticationState(false) }}>
                        <User20 />
                      </HeaderGlobalAction>
                    </>
                  }
                </HeaderGlobalBar>
                { showSidebar &&
                    <SideNav aria-label="Side navigation" isRail>
                      <SideNavItems>
                        <SideNavLink to={`/cores/${contextRealm.coreID}/realms/${contextRealm.id}/`} label="Dashboard" renderIcon={View32} />
                        <SideNavMenu renderIcon={Settings24} title="Configure">
                          <SideNavMenuItem to={`/cores/${contextRealm.coreID}/realms/${contextRealm.id}/config/devices`} label="Devices"/>
                          <SideNavMenuItem to={`/cores/${contextRealm.coreID}/realms/${contextRealm.id}/config/stacks`} label="Stacks"/>
                          <SideNavMenuItem to={`/cores/${contextRealm.coreID}/realms/${contextRealm.id}/config/panels`} label="Panels"/>
                          <SideNavMenuItem to={`/cores/${contextRealm.coreID}/realms/${contextRealm.id}/config/controllers`} label="Controllers"/>
                        </SideNavMenu>
                        <SideNavMenu renderIcon={Keyboard24} title="Control">
                          <SideNavMenuItem to={`/cores/${contextRealm.coreID}/realms/${contextRealm.id}/control/shotbox`} label="Shotbox"/>
                        </SideNavMenu>
                        <SideNavMenu renderIcon={TreeViewAlt24} title="Core">
                          <SideNavMenuItem to={`/cores/${contextRealm.coreID}/configuration`} label="Configuration"/>
                          <SideNavMenuItem to={`/cores/${contextRealm.coreID}/realms`} label="Realms"/>
                        </SideNavMenu>
                      </SideNavItems>
                    </SideNav>
                }
              </Header>
              { result.loading && <Loading /> }
              <Content id="main-content">
                <Suspense fallback={<Loading/>} >
                  <Grid style={{ maxWidth: fullWidth ? '200rem' : '90rem' }}>
                    <Row>
                      <Column>
                        <ErrorBoundary fallback={<ReactError />}>
                          <Switch>
                            { !isAuthenticated && result.data &&
                                  <>
                                    <Redirect to="/login" />
                                    <Route exact path="/login">
                                      <Login auth={setAuthenticationState}/>
                                    </Route>
                                  </>
                            }
                            { isAuthenticated && result.data && !contextRealm.id &&
                              <>
                                {/* REDIRECTS */}
                                <Route path="/:anything">
                                  <Redirect to="/" />
                                </Route>
                                <Route path="/" >
                                  <Landing realms={result.data.realms} realm={contextRealm} setRealm={setContextRealm} />
                                </Route>
                              </>
                            }
                            { isAuthenticated && result.data && contextRealm.id &&
                              <>
                                {/* CONFIGURE */}
                                <Route exact path="/cores/:core/realms/:realm/config/devices/:id" component={Device} />
                                <Route exact path="/cores/:core/realms/:realm/config/devices" component={Devices} />
                                <Route exact path="/cores/:core/realms/:realm/config/stacks/:id" component={StackWrapper} />
                                <Route exact path="/cores/:core/realms/:realm/config/stacks" component={Stacks} />
                                <Route exact path="/cores/:core/realms/:realm/config/panels/:id" component={PanelWrapper} />
                                <Route exact path="/cores/:core/realms/:realm/config/panels" component={Panels} />
                                <Route exact path="/cores/:core/realms/:realm/config/controllers" component={Controllers} />
                                {/* CONTROL */}
                                <Route exact path="/cores/:core/realms/:realm/control/shotbox" component={Shotbox} />
                                <Route exact path="/cores/:core/realms/:realm/control/shotbox/:id" component={ShotboxPanelWrapper} />
                                <Route exact path="/cores/:core/realms/:realm/control/flow" component={Flow} />
                                {/* CORE/REALM */}
                                <Route exact path="/cores/:core/configuration">
                                  <Core updateAndSetRealm={updateAndSetRealm} />
                                </Route>
                                <Route exact path="/cores/:core/realms">
                                  <Realms updateRealmsQuery={reexecuteRealmsQuery} />
                                </Route>
                                {/* MONITOR */}
                                <Route exact strict path="/cores/:core/realms/:realm/" component={Dashboard} />
                                {/* REDIRECTS */}
                                <Route exact path="/login">
                                  <Redirect to="/" />
                                </Route>
                                <Route exact path="/" >
                                  <Redirect to={`/cores/${contextRealm.coreID}/realms/${contextRealm.id}/`} />
                                  {/* <Landing realms={result.data.realms} realm={contextRealm} setRealm={setContextRealm} /> */}
                                </Route>
                              </>
                            }
                          </Switch>
                        </ErrorBoundary>
                      </Column>
                    </Row>
                  </Grid>
                </Suspense>
              </Content>
            </>
          )}
        />
      </div>
    )
  }
}

export default BorealDirector
