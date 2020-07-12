import React from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from 'react-router-dom'
import HeaderContainer from 'carbon-components-react/lib/components/UIShell/HeaderContainer'
import {
  Content,
  Header,
  HeaderMenuButton,
  HeaderName,
  SkipToContent,
  SideNav,
  SideNavItems
} from 'carbon-components-react/lib/components/UIShell'
import { View32, Settings24, Keyboard24 } from '@carbon/icons-react'

import NavLink from './components/NavLink.jsx'
import NavGroup from './components/NavGroup.jsx'

import Devices from './Devices/Devices.jsx'
import Flow from './Flow/Flow.jsx'
import Logs from './Logs/Logs.jsx'
import Panels from './Panels/Panels.jsx'
import Stacks from './Stacks/Stacks.jsx'
import Shotbox from './Shotbox/Shotbox.jsx'
import Status from './Status/Status.jsx'

import logo from '../../logos/Dark_Icon.svg'

const ControlPanel = () => (
  <div className="container bx--theme--g100">
    <Router>
      <HeaderContainer
        render={({ isSideNavExpanded, onClickSideNavExpand }) => (
          <>
            <Header aria-label="Boreal Systems Director">
              <SkipToContent />
              <HeaderMenuButton
                aria-label="Open menu"
                onClick={onClickSideNavExpand}
                isActive={isSideNavExpanded}
              />
              <img style={{ marginLeft: '10px', marginRight: '-7px' }} height='36px' src={logo} />
              <HeaderName href="/" prefix='Boreal Systems'>
                Director
              </HeaderName>
              {/* <HeaderGlobalBar>
                <HeaderGlobalAction aria-label="Search" onClick={() => {}}>
                  <Search20 />
                </HeaderGlobalAction>
                <HeaderGlobalAction aria-label="Notifications" onClick={() => {}}>
                  <Notification20 />
                </HeaderGlobalAction>
                <HeaderGlobalAction aria-label="User" onClick={() => {}}>
                  <User20 />
                </HeaderGlobalAction>
              </HeaderGlobalBar> */}
              <SideNav aria-label="Side navigation" expanded={isSideNavExpanded}>
                <SideNavItems>
                  <NavGroup icon={View32} label="Monitor" grouppath="/monitor">
                    <NavLink to="/monitor/status" label="Status"/>
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
                        <h1>Controllers</h1>
                      </Route>
                      {/* ROOT */}
                      <Route exact path="/">
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

export default ControlPanel
