// eslint-disable-next-line no-unused-vars
import React, { Component } from 'react'
import { hot } from 'react-hot-loader'

// Alerts
import Alert from '../components/Alert.jsx'

const uuidv4 = require('uuid/v4')

class Status extends Component {
  render () {
    return (
      <div className="container mx-auto">
        <div className="flex flex-col mt-32">
          <Alert type='error' subject='Issues' message='Systems Are Experiencing Serious Errors'/>
          <Alert type='warn' message='Device (Streamdeck 1) Disconnected'/>
          <Alert type='success' subject='Device Definitions Reloaded' message='Device Definitions have been updated successfully'/>
          <Alert type='info' subject='Action Trigger' message={uuidv4()}/>
        </div>
      </div>
    )
  }
}

export default hot(module)(Status)
