// eslint-disable-next-line no-unused-vars
import React, { Component } from 'react'
import { hot } from 'react-hot-loader'
import DeviceListing from '../components/DeviceListing.jsx'

class Devices extends Component {
  render () {
    return (
      <div className="container mx-auto">
        <DeviceListing />
      </div>
    )
  }
}

export default hot(module)(Devices)
