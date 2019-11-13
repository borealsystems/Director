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
    this.state = { tabIndex: 0 }

    // Styles for tab buttons
    this.styleTabInactive = 'block w-56 py-1 pl-5 object-right'
    this.styleTabActive = this.styleTabInactive + ' ' + 'bg-purple-800'
  }

  render (state) {
    return (
      <Router>
        <div className="container flex h-screen min-w-full">
          <div className="flex-none w-56 text-white text-lg font-thin bg-indigo-900">
            <NavLink to="/"><Logo className="text-center text-2xl py-3" /></NavLink>
            <div className="h-px my-2 bg-gray-500"></div>
            <span className={this.styleTabInactive + ' text-sm text-gray-500 uppercase'}>Manage</span>
            <NavLink to="/Status" className={this.styleTabInactive} activeClassName={this.styleTabActive}>Status</NavLink>
            <NavLink to="/Actions" className={this.styleTabInactive} activeClassName={this.styleTabActive}>Actions</NavLink>
            <NavLink to="/Variables" className={this.styleTabInactive} activeClassName={this.styleTabActive}>Variables</NavLink>
            <NavLink to="/Automation" className={this.styleTabInactive} activeClassName={this.styleTabActive}>Automation</NavLink>
            <NavLink to="/Devices" className={this.styleTabInactive} activeClassName={this.styleTabActive}>Devices</NavLink>
            <div className="h-px my-2 bg-gray-500"></div>
            <span className={this.styleTabInactive + ' text-sm text-gray-500 uppercase'}>Configuration</span>
            <NavLink to="/Configuration" className={this.styleTabInactive} activeClassName={this.styleTabActive}>Settings</NavLink>
            <NavLink to="/Configuration" className={this.styleTabInactive} activeClassName={this.styleTabActive}>Users</NavLink>
            <NavLink to="/Configuration" className={this.styleTabInactive} activeClassName={this.styleTabActive}>Partitions</NavLink>
            <span className={this.styleTabInactive + ' absolute bottom-0 mb-3 font-normal'}>
              <Clock />
            </span>
          </div>

          {/* A <Switch> looks through its children <Route>s and
              renders the first one that matches the current URL. */}
          <div className="flex-1 h-screen overflow-y-scroll">
            <div className="container mx-auto py-2">
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
