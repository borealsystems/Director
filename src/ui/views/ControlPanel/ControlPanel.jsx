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
  HeaderGlobalAction,
  HeaderGlobalBar,
  HeaderMenuButton,
  HeaderName,
  SkipToContent,
  SideNav,
  SideNavItems
} from 'carbon-components-react/lib/components/UIShell'
import { View32, Settings24, Keyboard24, Search20, User20, Notification20 } from '@carbon/icons-react'

import NavLink from './components/NavLink.jsx'
import NavGroup from './components/NavGroup.jsx'

import Flow from './Flow/Flow.jsx'
import Logs from './Logs/Logs.jsx'
import Status from './Status/Status.jsx'

const ControlPanel = () => (
  <div className="container">
    <Router>
      <HeaderContainer
        render={({ isSideNavExpanded, onClickSideNavExpand }) => (
          <>
            <Header aria-label="IBM Platform Name">
              <SkipToContent />
              <HeaderMenuButton
                aria-label="Open menu"
                onClick={onClickSideNavExpand}
                isActive={isSideNavExpanded}
              />
              <HeaderName href="/" prefix='Boreal Systems'>
                Director
              </HeaderName>
              <HeaderGlobalBar>
                <HeaderGlobalAction aria-label="Search" onClick={() => {}}>
                  <Search20 />
                </HeaderGlobalAction>
                <HeaderGlobalAction aria-label="Notifications" onClick={() => {}}>
                  <Notification20 />
                </HeaderGlobalAction>
                <HeaderGlobalAction aria-label="User" onClick={() => {}}>
                  <User20 />
                </HeaderGlobalAction>
              </HeaderGlobalBar>
              <SideNav aria-label="Side navigation" expanded={isSideNavExpanded}>
                <SideNavItems>
                  <NavGroup icon={View32} label="Monitor" grouppath="/monitor">
                    <NavLink to="/monitor/status" label="Status"/>
                    <NavLink to="/monitor/logs" label="Logs"/>
                  </NavGroup>
                  <NavGroup icon={Keyboard24} label="Control" grouppath="/control">
                    <NavLink to="/control/shotbox" label="Shotbox"/>
                    <NavLink to="/control/flow" label="Flow"/>
                  </NavGroup>
                  <NavGroup icon={Settings24} label="Configure" grouppath="/config">
                    <NavLink to="/config/devices" label="Devices"/>
                    <NavLink to="/config/actions" label="Actions"/>
                    <NavLink to="/config/controllers" label="Controllers"/>
                  </NavGroup>
                </SideNavItems>
              </SideNav>
            </Header>
            <Switch>
              <Content id="main-content">
                <div className="bx--grid">
                  <div className="bx--row">
                    <section className="bx--offset-lg-2 bx--col-lg-13">
                      {/* MONITOR */}
                      <Route exact path="/monitor">
                        <Redirect path="/monitor/status" />
                      </Route>
                      <Route path="/monitor/status">
                        <Status />
                      </Route>
                      <Route path="/monitor/logs">
                        <Logs />
                      </Route>
                      {/* CONTROL */}
                      <Route path="/control/shotbox">
                        <h1>Shotbox</h1>
                      </Route>
                      <Route path="/control/flow">
                        <Flow />
                      </Route>
                      {/* CONFIGURE */}
                      <Route path="/config/devices">
                        <h1>Devices</h1>
                      </Route>
                      <Route path="/config/actions">
                        <h1>Actions</h1>
                      </Route>
                      <Route path="/config/controllers">
                        <h1>Controllers</h1>
                      </Route>
                      {/* ROOT */}
                      <Route exact path="/">
                        <Redirect path="/monitor/status" />
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
