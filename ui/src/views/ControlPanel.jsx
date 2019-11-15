// eslint-disable-next-line no-unused-vars
import React, { Component } from 'react'
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
import Status from './Status.jsx'
import Actions from './Actions.jsx'
import Variables from './Variables.jsx'
import Automation from './Automation.jsx'
import Devices from './Devices.jsx'
import Configuration from './Configuration.jsx'

class ControlPanel extends Component {
  constructor (props) {
    super(props)
    this.state = { user: 'Firstname Lastname' }

    // Styles for tab buttons
    this.styleTabInactive = 'block w-56 py-1 pl-5 object-right'
    this.styleTabActive = this.styleTabInactive + ' ' + 'bg-purple-800'
  }

  render (state) {
    return (
      <Router>
        <div className="container bg-gray-800 text-white flex h-screen min-w-full">
          <div className="flex-none w-56 text-white text-lg font-thin bg-indigo-900 overflow-y-scroll">
            <NavLink to="/"><Logo className="text-center text-2xl py-3" /></NavLink>
            <div className="h-px mb-2 bg-gray-500"></div>
            <span className={this.styleTabInactive + ' text-xs text-gray-500 uppercase'}>Manage</span>
            <NavLink to="/Status" className={this.styleTabInactive} activeClassName={this.styleTabActive}>Status</NavLink>
            <NavLink to="/Actions" className={this.styleTabInactive} activeClassName={this.styleTabActive}>Actions</NavLink>
            <NavLink to="/Devices" className={this.styleTabInactive} activeClassName={this.styleTabActive}>Devices</NavLink>
            <NavLink to="/Controllers" className={this.styleTabInactive} activeClassName={this.styleTabActive}>Controllers</NavLink>
            <NavLink to="/Variables" className={this.styleTabInactive} activeClassName={this.styleTabActive}>Variables</NavLink>
            <NavLink to="/Automation" className={this.styleTabInactive} activeClassName={this.styleTabActive}>Automation</NavLink>
            <div className="h-px my-2 bg-gray-500"></div>
            <span className={this.styleTabInactive + ' text-xs text-gray-500 uppercase'}>Configure</span>
            <NavLink to="/Configuration" className={this.styleTabInactive} activeClassName={this.styleTabActive}>Settings</NavLink>
            <NavLink to="/Configuration" className={this.styleTabInactive} activeClassName={this.styleTabActive}>Users</NavLink>
            <NavLink to="/Configuration" className={this.styleTabInactive} activeClassName={this.styleTabActive}>Partitions</NavLink>
            <div className="h-px my-2 bg-gray-500"></div>
            <span className={this.styleTabInactive + ' text-xs text-gray-500 uppercase'}>Control</span>
            <NavLink to="/Configuration" className={this.styleTabInactive} activeClassName={this.styleTabActive}>Action Runner</NavLink>
            <NavLink to="/Configuration" className={this.styleTabInactive} activeClassName={this.styleTabActive}>Control View</NavLink>
            <div className="h-px my-2 bg-gray-500"></div>
            <span className={this.styleTabInactive + ' text-xs text-gray-500 uppercase'}>Account</span>
            <NavLink to="/Configuration" className={this.styleTabInactive} activeClassName={this.styleTabActive}>Settings</NavLink>
            <span className={this.styleTabInactive + ' absolute bottom-0 mb-3 text-sm text-gray-500 uppercase'}>
              {this.state.user}<br />
              LOGOUT
            </span>
            <span className={this.styleTabInactive + ' absolute bottom-0 mb-16 font-normal'}>
              <Clock />
            </span>
          </div>

          <div className="flex-1 h-screen overflow-y-scroll">
            <div className="container mx-auto px-2 py-10">
              <Switch>
                <Route path="/Status">
                  <Status />
                </Route>
                <Route path="/Variables">
                  <Variables />
                </Route>
                <Route path="/Actions">
                  <Actions />
                </Route>
                <Route path="/Variables">
                  <Variables />
                </Route>
                <Route path="/Automation">
                  <Automation />
                </Route>
                <Route path="/Devices">
                  <Devices />
                </Route>
                <Route path="/Configuration">
                  <Configuration />
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
}

export default hot(module)(ControlPanel)
