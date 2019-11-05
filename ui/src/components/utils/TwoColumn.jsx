// eslint-disable-next-line no-unused-vars
import React, { Component } from 'react'
import { hot } from 'react-hot-loader'

class TwoColumn extends Component {
  render () {
    return (
      <div className="lg:flex overflow-auto my-4">
        <div className="lg:w-1/2 md:block md:mb-2 px-4">{this.props.left}</div>
        <div className="lg:w-1/2 md:block md:mt-2 px-4">{this.props.right}</div>
      </div>
    )
  }
}

export default hot(module)(TwoColumn)
