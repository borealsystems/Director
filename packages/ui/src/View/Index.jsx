import React, { useState, useContext } from 'react'
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
import { Keyboard24, Settings24, TreeViewAlt24, User20, View32 } from '@carbon/icons-react'

import Controllers from './Controllers/Controllers.jsx'
import Core from './Core/Core.jsx'
import Clock from './components/Clock.jsx'
import Dashboard from './Dashboard/Dashboard.jsx'
import Device from './Device/DeviceWrapper.jsx'
import Devices from './Devices/Devices.jsx'
import Flow from './Flow/Flow.jsx'
import GraphQLError from './components/GraphQLError.jsx'
import Landing from './Landing/Landing.jsx'
import Login from './Login/Login.jsx'
import PanelWrapper from './Panels/PanelWrapper.jsx'
import Panels from './Panels/Panels.jsx'
import Shotbox from './Shotbox/Shotbox.jsx'
import ShotboxPanelWrapper from './Shotbox/ShotboxPanelWrapper.jsx'
import SideNavMenuItem from './components/SideNavMenuItem.jsx'
import SideNavLink from './components/SideNavLink.jsx'
import Stacks from './Stacks/Stacks.jsx'

import globalContext from '../globalContext'
import './index.css'

const BorealDirector = () => {
  const [isAuthenticated, setAuthenticationState] = useState(true)
  const { realm, setRealm } = useContext(globalContext)
  const [realms, setRealms] = useState([])

  const history = useHistory()

  const [result] = useQuery({
    query: `{ 
      cores {
        id
        label
        timezone
        realms{
          id
          label
        }
      }
      thisCore {
        id
        label
      }
     }`
  })

  const showSidebar = isAuthenticated && result.data && !useRouteMatch('/:core/:realm/control/shotbox/:id') && !useRouteMatch({ path: '/', exact: true }) && realm.core
  const fullWidth = useRouteMatch({ path: '/:core/:realm/', exact: true }) || useRouteMatch({ path: '/', exact: true })
  const showTopRealmSelect = realm.realm && realms.length > 0 && !useRouteMatch({ path: '/', exact: true }) && !useRouteMatch({ path: '/:core/:realm/control/shotbox/:id', exact: true })

  if (result.data && realms.length === 0) {
    const realmsArray = []
    result.data.cores.map((core, coreIndex) => {
      core.realms.map((realm, realmIndex) => {
        realmsArray.push({ id: `${coreIndex},${realmIndex}`, realm: realm, core: { id: core.id, label: core.label } })
        if (realmIndex === core.realms.length - 1 && coreIndex === result.data.cores.length - 1) {
          console.log('FINISHED')
          console.log(realmsArray)
          setRealms(realmsArray)
        }
      })
    })
    setRealm({
      id: '0,0',
      realm: {
        id: 'root',
        label: 'Default'
      },
      core: result.data.thisCore
    })
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
                <HeaderName onClick={() => history.push({ pathname: `/${realm.core.id}/${realm.realm.id}/` })} prefix='BorealSystems'>
                  Director
                </HeaderName>
                <HeaderNavigation aria-label="BorealSystems Director">
                  { showTopRealmSelect &&
                    <ComboBox
                      className='coreSelect'
                      ariaLabel="Dropdown"
                      id="panel"
                      label='Select a panel'
                      placeholder='Core'
                      selectedItem={realm}
                      items={realms}
                      itemToString={(item) => { return item.realm?.id === 'root' ? item.core?.label : `${item.core?.label} / ${item.realm?.label}` }}
                      onChange={(event) => { setRealm(event.selectedItem) }}
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
                      <HeaderGlobalAction aria-label="User" onClick={() => { setAuthenticationState(false) }}>
                        <User20 />
                      </HeaderGlobalAction>
                  }
                </HeaderGlobalBar>
                { showSidebar &&
                    <SideNav aria-label="Side navigation" isRail>
                      <SideNavItems>
                        <SideNavLink to={`/${realm.core.id}/${realm.realm.id}/`} label="Dashboard" renderIcon={View32} />
                        <SideNavMenu renderIcon={Settings24} title="Configure">
                          <SideNavMenuItem to={`/${realm.core.id}/${realm.realm.id}/config/devices`} label="Devices"/>
                          <SideNavMenuItem to={`/${realm.core.id}/${realm.realm.id}/config/stacks`} label="Stacks"/>
                          <SideNavMenuItem to={`/${realm.core.id}/${realm.realm.id}/config/panels`} label="Panels"/>
                          <SideNavMenuItem to={`/${realm.core.id}/${realm.realm.id}/config/controllers`} label="Controllers"/>
                        </SideNavMenu>
                        <SideNavMenu renderIcon={Keyboard24} title="Control">
                          <SideNavMenuItem to={`/${realm.core.id}/${realm.realm.id}/control/shotbox`} label="Shotbox"/>
                        </SideNavMenu>
                        <SideNavMenu renderIcon={TreeViewAlt24} title="Core">
                          <SideNavMenuItem to={`/${realm.core.id}/configure`} label="Configuration"/>
                        </SideNavMenu>
                      </SideNavItems>
                    </SideNav>
                }
              </Header>
              { result.loading && <Loading /> }
              <Content id="main-content">
                <Grid style={{ maxWidth: fullWidth ? '200rem' : '90rem' }}>
                  <Row>
                    <Column>
                      <Switch>
                        { !isAuthenticated && result.data &&
                              <>
                                <Redirect to="/login" />
                                <Route exact path="/login">
                                  <Login auth={setAuthenticationState}/>
                                </Route>
                              </>
                        }
                        { isAuthenticated && result.data &&
                          <>
                            {/* CONFIGURE */}
                            <Route exact path="/:core/:realm/config/devices/:id" component={Device} />
                            <Route exact path="/:core/:realm/config/devices" component={Devices} />
                            <Route exact path="/:core/:realm/config/stacks" component={Stacks} />
                            <Route exact path="/:core/:realm/config/panels/:id" component={PanelWrapper} />
                            <Route exact path="/:core/:realm/config/panels" component={Panels} />
                            <Route exact path="/:core/:realm/config/controllers" component={Controllers} />
                            {/* CONTROL */}
                            <Route exact path="/:core/:realm/control/shotbox" component={Shotbox} />
                            <Route exact path="/:core/:realm/control/shotbox/:id" component={ShotboxPanelWrapper} />
                            <Route exact path="/:core/:realm/control/flow" component={Flow} />
                            {/* CORE */}
                            <Route exact path="/:core/configure" component={Core} />
                            {/* MONITOR */}
                            <Route exact path="/:core/:realm/" component={Dashboard} />
                            {/* REDIRECTS */}
                            <Route exact path="/login">
                              <Redirect to="/" />
                            </Route>
                            <Route exact path="/" >
                              <Landing realms={realms} realm={realm} setRealm={setRealm} />
                            </Route>
                          </>
                        }
                      </Switch>
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

export default BorealDirector
