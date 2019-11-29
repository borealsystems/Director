// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react'
import { hot } from 'react-hot-loader'

import {
  BrowserRouter as Router,
  Switch,
  Route,
  NavLink
} from 'react-router-dom'

// Components
import Logo from '../components/Logo.jsx'
import Clock from '../components/Clock.jsx'

// Subviews
import Actions from './Actions/Actions.jsx'
import Automation from './Automation/Automation.jsx'
import ControlView from './ControlView/ControlView.jsx'
import Controllers from './Controllers/Controllers.jsx'
import Devices from './Devices/Devices.jsx'
import Partitions from './Partitions/Partitions.jsx'
import Settings from './Settings/Settings.jsx'
import Shotbox from './Shotbox/Shotbox.jsx'
import Status from './Status/Status.jsx'
import UserPreferences from './UserPreferences/UserPreferences.jsx'
import Users from './Users/Users.jsx'
import Variables from './Variables/Variables.jsx'

const ControlPanel = () => {
  var user = useState({ firstname: 'firstname', lastname: 'lastname' })

  const styleTabInactive = 'block w-56 py-1 pl-5 object-right'
  const styleTabActive = styleTabInactive + ' ' + 'bg-purple-800'

  return (
    <Router>
      <div className="container bg-gray-800 text-white flex h-screen min-w-full">
        <div className="flex-none w-56 text-white text-lg font-thin bg-indigo-900 overflow-y-scroll">
          <NavLink to="/"><Logo className="text-center text-2xl py-3" /></NavLink>
          <div className="h-px mb-2 bg-gray-500"></div>
          <span className={styleTabInactive + ' text-xs text-gray-500 uppercase'}>Manage</span>
          <NavLink to="/Status" className={styleTabInactive} activeClassName={styleTabActive}>Status</NavLink>
          <NavLink to="/Actions" className={styleTabInactive} activeClassName={styleTabActive}>Actions</NavLink>
          <NavLink to="/Devices" className={styleTabInactive} activeClassName={styleTabActive}>Devices</NavLink>
          <NavLink to="/Controllers" className={styleTabInactive} activeClassName={styleTabActive}>Controllers</NavLink>
          <NavLink to="/Variables" className={styleTabInactive} activeClassName={styleTabActive}>Variables</NavLink>
          <NavLink to="/Automation" className={styleTabInactive} activeClassName={styleTabActive}>Automation</NavLink>
          <div className="h-px my-2 bg-gray-500"></div>
          <span className={styleTabInactive + ' text-xs text-gray-500 uppercase'}>Configure</span>
          <NavLink to="/Settings" className={styleTabInactive} activeClassName={styleTabActive}>Settings</NavLink>
          <NavLink to="/Users" className={styleTabInactive} activeClassName={styleTabActive}>Users</NavLink>
          <NavLink to="/Partitions" className={styleTabInactive} activeClassName={styleTabActive}>Partitions</NavLink>
          <div className="h-px my-2 bg-gray-500"></div>
          <span className={styleTabInactive + ' text-xs text-gray-500 uppercase'}>Control</span>
          <NavLink to="/Shotbox" className={styleTabInactive} activeClassName={styleTabActive}>Shotbox</NavLink>
          <NavLink to="/ControlView" className={styleTabInactive} activeClassName={styleTabActive}>Control View</NavLink>
          <div className="h-px my-2 bg-gray-500"></div>
          <span className={styleTabInactive + ' text-xs text-gray-500 uppercase'}>Account</span>
          <NavLink to="/UserPreferences" className={styleTabInactive} activeClassName={styleTabActive}>User Preferences</NavLink>
          <span className={styleTabInactive + ' absolute bottom-0 mb-3 text-sm text-gray-500 uppercase'}>
            {user.firstname} {user.lastname}<br />
              LOGOUT
          </span>
          <span className={styleTabInactive + ' absolute bottom-0 mb-16 font-normal'}>
            <Clock />
          </span>
        </div>

        <div className="flex-1 h-screen overflow-y-scroll">
          <div className="container mx-auto px-2 py-10">
            <Switch>
              <Route path="/Status">
                <Status />
              </Route>
              <Route path="/Actions">
                <Actions />
              </Route>
              <Route path="/Devices">
                <Devices />
              </Route>
              <Route path="/Controllers">
                <Controllers />
              </Route>
              <Route path="/Variables">
                <Variables />
              </Route>
              <Route path="/Automation">
                <Automation />
              </Route>
              <Route path="/Settings">
                <Settings />
              </Route>
              <Route path="/Users">
                <Users />
              </Route>
              <Route path="/Partitions">
                <Partitions />
              </Route>
              <Route path="/Shotbox">
                <Shotbox />
              </Route>
              <Route path="/ControlView">
                <ControlView />
              </Route>
              <Route path="/UserPreferences">
                <UserPreferences />
              </Route>
              <Route path="/">
                <span>Home</span>
              </Route>
            </Switch>
          </div>
        </div>
      </div>
    </Router>
  )
}

export default hot(module)(ControlPanel)
