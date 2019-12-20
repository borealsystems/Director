// eslint-disable-next-line no-unused-vars
import React, { Component } from 'react'
import { hot } from 'react-hot-loader'

// Components
import Log from './components/Log.jsx'
import SystemStatus from './components/SystemStatus.jsx'

class Status extends Component {
  constructor (props) {
    super(props)
    this.state = {
      logs: [
        { type: 'info', subject: 'System Initialisation', message: 'The system is loading' },
        { type: 'warn', subject: 'Stuff\'s not quite right', message: 'The system is loading' },
        { type: 'success', subject: 'System Initialisation', message: 'The system is loading' },
        { type: 'info', subject: 'System Initialisation', message: 'The system is loading' },
        { type: 'error', subject: 'It\'s Broken', message: 'The system is loading' },
        { type: 'info', subject: 'System Initialisation', message: 'The system is loading' },
        { type: 'info', subject: 'System Initialisation', message: 'The system is loading' },
        { type: 'info', subject: 'System Initialisation', message: 'The system is loading' },
        { type: 'info', subject: 'System Initialisation', message: 'The system is loading' },
        { type: 'info', subject: 'System Initialisation', message: 'The system is loading' },
        { type: 'info', subject: 'System Initialisation', message: 'The system is loading' },
        { type: 'info', subject: 'System Initialisation', message: 'The system is loading' }
      ]
    }
  }

  render () {
    return (
      <div>
        <div className='block mt-10'>
          <h1 className="text-xl text-gray-800 dark:text-gray-200 font-bold my-1">System Status</h1>
          <SystemStatus />
        </div>
        <br /><br />
        <div className='block'>
          <span className="text-xl text-gray-800 dark:text-gray-200 font-bold pb-4">Logs</span>
          <div style={{ height: '45vh' }} className="flex flex-col overflow-y-scroll">
            {this.state.logs.map((key, index) => <Log key={index} type={key.type} subject={key.subject} message={key.message}/>)}
          </div>
        </div>
      </div>
    )
  }
}

export default hot(module)(Status)
