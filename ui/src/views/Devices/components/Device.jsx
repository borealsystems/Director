import React, { Component } from 'react'
import { hot } from 'react-hot-loader'

class Device extends Component {
  constructor (props) {
    super(props)
    this.state = {
      showProperties: false
    }
  }

  colour () {
    return this.props.index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-900'
  }

  onClick (e) {
    e.preventDefault()
    this.setState({ showProperties: !this.state.showProperties })
  }

  render () {
    return (
      <div key={this.props.index} className={this.colour()}>
        <div className="text-center">
          <div className="inline-block w-3/6 h-10 py-2 px-2 border-t border-l border-gray-500">{this.props.name}</div>
          <div className="inline-block w-1/3 h-10 py-2 px-2 border-t border-l border-gray-500">{this.props.uuid}</div>
          <div className="inline-block w-1/6 h-10 py-2 px-2 border-t border-l border-r border-gray-500">
            {this.state.showProperties ? (
              <button className="text-xs text-gray-500 uppercase" onClick={this.onClick.bind(this)}>Less {'<'}</button>
            ) : (
              <button className="text-xs text-gray-500 uppercase" onClick={this.onClick.bind(this)}>More ></button>
            )}
          </div>
        </div>
        {this.state.showProperties &&
        <div className="w-100 h-64 py-2 px-2 border-l border-r border-t border-gray-500">
          <span>UUID: {this.props.uuid} </span><br/>
          <span>Name: {this.props.name} </span><br/>
          <span>Config: {JSON.stringify(this.props.config)}</span>
        </div>
        }
      </div>
    )
  }
}

export default hot(module)(Device)
