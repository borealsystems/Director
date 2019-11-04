// eslint-disable-next-line no-unused-vars
import React, { Component } from 'react'
import { hot } from 'react-hot-loader'

class TwoColumn extends Component {
  render () {
    return (
      <div className="h-screen lg:flex my-4">
        <div className="h-screen lg:w-1/2 overflow-y-scroll md:block md:mb-2 px-4">{this.props.left}</div>
        <div className="h-screen lg:w-1/2 overflow-y-scroll md:block md:mt-2 px-4">{this.props.right}</div>
      </div>
    )
  }
}

export default hot(module)(TwoColumn)
