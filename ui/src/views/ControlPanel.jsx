// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react'
import { hot } from 'react-hot-loader'

import {
  BrowserRouter as Router,
  Switch,
  Route,
  NavLink,
  Redirect
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

var theme = null

if (theme == null) {
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    theme = 'dark'
  }
}

const toggleTheme = () => {
  if (theme !== 'dark') {
    document.documentElement.classList.add('mode-dark')
    theme = 'dark'
  } else {
    document.documentElement.classList.remove('mode-dark')
    theme = 'light'
  }
}

const ControlPanel = () => {
  var user = useState({ firstname: 'firstname', lastname: 'lastname' })

  const styleTabInactive = 'block rounded-l-lg w-56 py-1 pl-5 object-right'
  const styleTabActive = styleTabInactive + ' ml-2 w-64 bg-teal-400 shadow-md dark:shadow-none'
  const styleSubHeading = styleTabInactive + ' text-xs text-gray-800 uppercase'
  const styleLine = 'h-px w-64 my-2 bg-gray-700'

  return (
    <Router>
      <Redirect from="/" to="/Status" />
      <div className="container bg-teal-500 text-gray-900 dark:text-gray-100 text-heading flex h-screen min-w-full">
        <div className="flex">
          <div style={{ height: '85vh' }} className="flex-initial h-screen w-56 text-lg text-gray-900  bg-teal-500 overflow-y-visible">
            <button className='w-64 -ml-3 pt-2 focus:outline-none' onClick={() => toggleTheme()}><Logo className="text-center text-2xl py-3" /></button>
            <div className={styleLine}></div>
            <span className={styleSubHeading}>Manage</span>
            <NavLink to="/Status" className={styleTabInactive} activeClassName={styleTabActive}>Status</NavLink>
            <NavLink to="/Devices" className={styleTabInactive} activeClassName={styleTabActive}>Devices</NavLink>
            <NavLink to="/Actions" className={styleTabInactive} activeClassName={styleTabActive}>Actions</NavLink>
            <NavLink to="/Controllers" className={styleTabInactive} activeClassName={styleTabActive}>Controllers</NavLink>
            <NavLink to="/Variables" className={styleTabInactive} activeClassName={styleTabActive}>Variables</NavLink>
            <NavLink to="/Automation" className={styleTabInactive} activeClassName={styleTabActive}>Automation</NavLink>
            <div className={styleLine}></div>
            <span className={styleSubHeading}>Configure</span>
            <NavLink to="/Settings" className={styleTabInactive} activeClassName={styleTabActive}>Settings</NavLink>
            <NavLink to="/Users" className={styleTabInactive} activeClassName={styleTabActive}>Users</NavLink>
            <NavLink to="/Partitions" className={styleTabInactive} activeClassName={styleTabActive}>Partitions</NavLink>
            <div className={styleLine}></div>
            <span className={styleSubHeading}>Control</span>
            <NavLink to="/Shotbox" className={styleTabInactive} activeClassName={styleTabActive}>Shotbox</NavLink>
            <NavLink to="/ControlView" className={styleTabInactive} activeClassName={styleTabActive}>Control View</NavLink>
            <div className={styleLine}></div>
            <span className={styleSubHeading}>User</span>
            <NavLink to="/UserPreferences" className={styleTabInactive} activeClassName={styleTabActive}>User Preferences</NavLink>
          </div>
          <div className="flex-1 absolute bottom-0 w-56 text-sm uppercase text-gray-900 bg-teal-400 h-20 mb-4 rounded-r-lg shadow-lg dark:shadow-none">
            <div className={styleTabInactive}>
              <span >
                {user[0].firstname} {user[0].lastname}<br />
                  LOGOUT
              </span>
              <span className="text-lg font-light">
                <Clock />
              </span>
            </div>
          </div>
        </div>
        <div className="flex-1 rounded-l-lg my-4 ml-4 bg-gray-200 dark:bg-gray-800 overflow-y-scroll shadow-xl">
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
