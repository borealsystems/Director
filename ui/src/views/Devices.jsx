// eslint-disable-next-line no-unused-vars
import React, { Component } from 'react'
import { hot } from 'react-hot-loader'
var uuidBase62 = require('uuid-base62')

class Devices extends Component {
  render () {
    return (
      <div className="w-100">
        <div className="bg-gray-700 text-center font-bold border border-gray-500 border-b-0 rounded-t-lg">
          <div className="inline-block w-3/6 py-2 px-2">Name</div>
          <div className="inline-block w-1/3 py-2 px-2">UUID</div>
          <div className="inline-block w-1/6 py-2 px-2"></div>
        </div>
        <div>
          <div className="text-center">
            <div className="inline-block w-3/6 h-10 py-2 px-2 border-t border-l border-gray-500">Roll Stinger</div>
            <div className="inline-block w-1/3 h-10 py-2 px-2 border-t border-l border-gray-500">{uuidBase62.v1()}</div>
            <div className="inline-block w-1/6 h-10 py-2 px-2 border-t border-l border-r border-gray-500">
              {/* {this.state.isActive ? (
                <button className="text-xs text-gray-500 uppercase" onClick={this.handleHide}>Less {'<'}</button>
              ) : (
                <button className="text-xs text-gray-500 uppercase" onClick={this.handleShow}>More ></button>
              )} */}
            </div>
          </div>
          {/* {this.state.isActive &&
            <div className="w-100 h-10 py-2 px-2 border-l border-r border-t border-gray-500">
              <span>Action</span>
            </div>
          } */}
        </div>
        <div className="bg-gray-700 text-center font-bold border border-gray-500 rounded-b-lg">
          <div className="inline-block w-5/6 py-2 px-2"></div>
          <div className="inline-block w-1/6 py-2 px-2"><button className="bg-indigo-900 py-1 px-5 rounded">New</button></div>
        </div>
      </div>
    )
  }
}

export default hot(module)(Devices)
