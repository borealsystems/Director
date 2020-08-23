import React from 'react'

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
  Loading
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
import Panels from './Panels/Panels.jsx'
import Stacks from './Stacks/Stacks.jsx'
import Shotbox from './Shotbox/Shotbox.jsx'
import Status from './Status/Status.jsx'

import logo from '../../../../common/logos/Dark_Icon.svg'

const ControlPanel = () => {
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
                  <img style={{ marginLeft: '10px', marginRight: '-7px' }} height='36px' src={logo} />
                  <HeaderName href="/" prefix='BorealSystems'>
                    Director @ {result.data.coreConfig.label}
                  </HeaderName>
                  <HeaderGlobalBar>
                    <HeaderGlobalAction aria-label="User" onClick={() => {}}>
                      <User20 />
                    </HeaderGlobalAction>
                    <HeaderGlobalAction aria-label="Switcher" onClick={() => {}}>
                      <Switcher20 />
                    </HeaderGlobalAction>
                  </HeaderGlobalBar>
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
                        {/* TODO: decide if i even want to implement flows, are they relevent to the direction of this project? */}
                        {/* <NavLink to="/control/flow" label="Flow"/> */}
                      </NavGroup>
                      <NavGroup icon={TreeViewAlt24} label="Core" grouppath="/core">
                        <NavLink to="/core/configure" label="Configuration"/>
                      </NavGroup>
                    </SideNavItems>
                  </SideNav>
                </Header>
                <Switch>
                  <Content id="main-content">
                    <div className="bx--grid">
                      <div className="bx--row">
                        <section className="bx--offset-lg-2 bx--col-lg-10">
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
                        </section>
                      </div>
                    </div>
                  </Content>
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
