// eslint-disable-next-line no-unused-vars
import React, { Component } from 'react'
import { hot } from 'react-hot-loader'

// Components
import Alert from '../components/Alert.jsx'
import SystemStatus from '../components/SystemStatus.jsx'
import TwoColumn from '../components/utils/TwoColumn.jsx'

const uuidv4 = require('uuid/v4')

class Status extends Component {
  render () {
    return (
      <div className="container py-2">
        <TwoColumn left={
          <div>
            <span className="text-xl font-bold pb-10">System Status</span>
            <SystemStatus status='error' message='Systems Are Experiencing Serious Errors'/>
          </div>
        } right={
          <div>
            <span className="text-xl font-bold pb-4">Logs</span>
            <div className="flex flex-col overflow-y-scroll">
              <Alert type='error' subject='Issues' message='Systems Are Experiencing Serious Errors'/>
              <Alert type='warn' message='Device (Streamdeck 1) Disconnected'/>
              <Alert type='success' subject='Device Definitions Reloaded' message='Device Definitions have been updated successfully'/>
              <Alert type='info' subject='Device Connected' message="Device (Streamdeck 1) Has Connected"/>
              <Alert type='info' subject='Action Trigger' message={uuidv4()}/>
              <Alert type='success' subject='DB Loaded' message='System Database has loaded successfully'/>
              <Alert type='error' subject='Issues' message='Systems Are Experiencing Serious Errors'/>
              <Alert type='warn' message='Device (Streamdeck 1) Disconnected'/>
              <Alert type='success' subject='Device Definitions Reloaded' message='Device Definitions have been updated successfully'/>
              <Alert type='info' subject='Device Connected' message="Device (Streamdeck 1) Has Connected"/>
              <Alert type='info' subject='Action Trigger' message={uuidv4()}/>
              <Alert type='success' subject='DB Loaded' message='System Database has loaded successfully'/>
              <Alert type='error' subject='Issues' message='Systems Are Experiencing Serious Errors'/>
              <Alert type='warn' message='Device (Streamdeck 1) Disconnected'/>
              <Alert type='success' subject='Device Definitions Reloaded' message='Device Definitions have been updated successfully'/>
              <Alert type='info' subject='Device Connected' message="Device (Streamdeck 1) Has Connected"/>
              <Alert type='info' subject='Action Trigger' message={uuidv4()}/>
              <Alert type='success' subject='DB Loaded' message='System Database has loaded successfully'/>
            </div>
          </div>
        } />
      </div>
    )
  }
}

export default hot(module)(Status)
