// eslint-disable-next-line no-unused-vars
import React, { Component } from 'react'
import { hot } from 'react-hot-loader'

// Components
import Alert from '../../components/Alert.jsx'
import SystemStatus from './components/SystemStatus.jsx'

class Status extends Component {
  constructor (props) {
    super(props)
    this.state = { logs: [{ type: 'info', subject: 'System Initialisation', message: 'The system is loading' }] }
  }

  render () {
    return (
      <div>
        <div className='block mt-10'>
          <h1 className="text-xl font-bold my-1">System Status</h1>
          <SystemStatus />
        </div>
        <br /><br />
        <div className='block'>
          <span className="text-xl font-bold pb-4">Logs</span>
          <div style={{ height: '60%' }}className="flex flex-col overflow-y-scroll">
            {this.state.logs.map((key, index) => <Alert key={key} type={key.type} subject={key.subject} message={key.message}/>)}
          </div>
        </div>
      </div>
    )
  }
}

export default hot(module)(Status)
