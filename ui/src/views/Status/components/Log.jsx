// eslint-disable-next-line no-unused-vars
import React, { Component } from 'react'
import { hot } from 'react-hot-loader'

// TODO: Fix Blue Line

class Log extends Component {
  render () {
    if (this.props.type === 'info') {
      return (
        <div className="flex-none bg-blue-900 mb-2">
          <div className="block w-1 bg-blue-500">
          </div>
          <div className="block w-auto items-center p-2">
            <span className="text-sm font-bold pb-2">
              {this.props.subject || 'Info'}{' '}
            </span>
            <span className="text-sm">
              {this.props.message}
            </span>
          </div>
        </div>
      )
    } else if (this.props.type === 'success') {
      return (
        <div className="flex bg-green-900 mb-2">
          <div className="w-1 bg-green-500"></div>
          <div className="w-auto items-center p-2">
            <span className="text-sm font-bold pb-2">
              {this.props.subject || 'Success'}{' '}
            </span>
            <span className="text-sm">
              {this.props.message}
            </span>
          </div>
        </div>
      )
    } else if (this.props.type === 'warn') {
      return (
        <div className="flex bg-yellow-900 mb-2">
          <div className="w-1 bg-yellow-400">
          </div>
          <div className="w-auto text-grey-darker items-center p-2 pt-1">
            <span className="text-sm font-bold pb-2">
              {this.props.subject || 'Warning'}
            </span>
            <p className="text-sm">
              {this.props.message}
            </p>
          </div>
        </div>
      )
    } else if (this.props.type === 'error') {
      return (
        <div className="flex bg-red-900 mb-2">
          <div className="w-1 bg-red-400">
          </div>
          <div className="w-auto text-grey-darker items-center p-2 pt-1">
            <span className="text-sm font-bold pb-2">
              {this.props.subject || 'Error'}
            </span>
            <p className="text-sm">
              {this.props.message}
            </p>
          </div>
        </div>
      )
    } else {
      return (null)
    }
  }
}

export default hot(module)(Log)
