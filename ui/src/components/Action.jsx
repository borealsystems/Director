import React, { Component } from 'react'
import { hot } from 'react-hot-loader'
var uuidBase62 = require('uuid-base62');
var uuid = uuidBase62.v4();

class Action extends Component {
  state = {
    isActive: false,
    uuid: '0'
  }

  handleShow = () => {
    this.setState({isActive: true});
  };

  handleHide = () => {
    this.setState({isActive: false});
  };

  render() {
      return (
        <div>
          <div className="text-center">
            <div className="inline-block w-3/6 h-10 py-2 px-2 border-t border-l border-gray-500">Roll Stinger</div>
            <div className="inline-block w-1/3 h-10 py-2 px-2 border-t border-l border-gray-500">{uuidBase62.v1()}</div>
            <div className="inline-block w-1/6 h-10 py-2 px-2 border-t border-l border-r border-gray-500">
              {this.state.isActive ?(
                <button className="text-xs text-gray-500 uppercase" onClick={this.handleHide}>Less {'<'}</button>
              ) : (
                <button className="text-xs text-gray-500 uppercase" onClick={this.handleShow}>More ></button>
              )}
            </div>
          </div>
          {this.state.isActive && 
            <div className="w-100 h-10 py-2 px-2 border-l border-r border-t border-gray-500">
              <span>Action</span>
            </div>
          }
        </div>
      )
  }
}

export default hot(module)(Action)
