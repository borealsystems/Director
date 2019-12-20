// eslint-disable-next-line no-unused-vars
import React, { Component } from 'react'
import { hot } from 'react-hot-loader'

// TODO: Fix Blue Line

class Log extends Component {
  render () {
    if (this.props.type === 'info') {
      return (
        <div className="flex-none bg-blue-400 dark:bg-blue-500 rounded-lg mr-1 mb-2">
          <div className="block w-auto items-center p-2">
            <span className="text-sm w-64 font-bold pb-2">
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
        <div className="flex bg-green-400 dark:bg-green-500 rounded-lg mr-1 mb-2">
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
        <div className="flex-none bg-orange-400 dark:bg-orange-500 rounded-lg mr-1 mb-2">
          <div className="block w-auto items-center p-2">
            <span className="text-sm font-bold pb-2">
              {this.props.subject || 'Warning'}{' '}
            </span>
            <span className="text-sm">
              {this.props.message}
            </span>
          </div>
        </div>
      )
    } else if (this.props.type === 'error') {
      return (
        <div className="flex-none bg-red-400 dark:bg-red-500 rounded-lg mr-1 mb-2">
          <div className="block w-auto items-center p-2">
            <span className="text-sm font-bold pb-2">
              {this.props.subject || 'Error'}{' '}
            </span>
            <span className="text-sm">
              {this.props.message}
            </span>
          </div>
        </div>
      )
    } else {
      return (null)
    }
  }
}

export default hot(module)(Log)
