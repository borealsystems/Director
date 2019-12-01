// eslint-disable-next-line no-unused-vars
import React, { Component } from 'react'
import { hot } from 'react-hot-loader'

import Device from './components/Device.jsx'
import NewDevice from './components/NewDevice.jsx'

var uuidBase62 = require('uuid-base62')

class Devices extends Component {
  constructor (props) {
    super(props)
    this.state = {
      showNewDevice: false,
      newDevice: {}
    }
    this.newDevice = this.newDevice.bind(this)
  }

  onClick (e) {
    e.preventDefault()
    this.setState({ showNewDevice: !this.state.showNewDevice })
  }

  newDevice (s) {
    this.setState(s)
  }

  submitNewDevice () {
    console.log(this.state.newDevice)
  }

  render () {
    return (
      <div className="w-100">
        <div className="bg-gray-700 text-center font-bold border border-gray-500 border-b-0 rounded-t-lg">
          <div className="inline-block w-3/6 py-2 px-2">Devices</div>
          <div className="inline-block w-1/6 py-2 px-2"></div>
          <div className="inline-block w-1/3 py-2 px-2">
            <input className="shadow appearance-none border border-gray-500 rounded bg-gray-700 w-full py-2 px-3 text-white leading-tight focus:outline-none focus:border-white" id="username" type="text" placeholder="Search" />
          </div>
        </div>
        <div className="bg-gray-800 text-center font-bold border border-gray-500 border-b-0">
          <div className="inline-block w-3/6 py-2 px-2">Name</div>
          <div className="inline-block w-1/3 py-2 px-2">UUID</div>
          <div className="inline-block w-1/6 py-2 px-2"></div>
        </div>
        <Device name="Sting" uuid={uuidBase62.v4()} index="1"/>
        <Device name="PreRoll" uuid={uuidBase62.v4()} index="2"/>
        <Device name="FTB" uuid={uuidBase62.v4()} index="3"/>
        <Device name="RollClip" uuid={uuidBase62.v4()} index="4"/>
        <Device name="Ad Break" uuid={uuidBase62.v4()} index="5"/>
        <Device name="Start Record" uuid={uuidBase62.v4()} index="6"/>
        <Device name="Stop Record" uuid={uuidBase62.v4()} index="7"/>
        <Device name="Network Bug" uuid={uuidBase62.v4()} index="8"/>
        {this.state.showNewDevice &&
          <NewDevice newDevice={this.newDevice}/>
        }
        <div className="bg-gray-700 text-center font-bold border border-gray-500 rounded-b-lg">
          {this.state.showNewDevice ? (
            <div>
              <div className="inline-block w-4/6 py-2 px-2"></div>
              <div className="inline-block w-1/6 ">
                <button className="py-2 px-2 ml-px h-10 border-l border-gray-500 w-full" onClick={this.onClick.bind(this)}>Cancel</button>
              </div>
              <div className="inline-block w-1/6 ">
                <button className="bg-indigo-900 py-2 px-2 ml-px h-10 rounded-br-lg border-l border-r border-gray-500 w-full" onClick={this.onClick.bind(this)}>Submit</button>
              </div>
            </div>
          ) : (
            <div>
              <div className="inline-block w-5/6 py-2 px-2"></div>
              <div className="inline-block w-1/6 ">
                <button className="bg-indigo-900 py-2 px-2 ml-px h-10 rounded-br-lg border-l border-r border-gray-500 w-full" onClick={this.onClick.bind(this)}>New</button>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }
}

export default hot(module)(Devices)
