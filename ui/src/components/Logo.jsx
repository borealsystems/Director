// eslint-disable-next-line no-unused-vars
import React, { Component } from 'react'
import { hot } from 'react-hot-loader'

// eslint-disable-next-line no-unused-vars
import IBMPlexSansCondensedLight from '../fonts/IBM_Plex_Sans_Condensed/IBMPlexSansCondensed-ExtraLight.ttf'
// eslint-disable-next-line no-unused-vars
import IBMPlexSansCondensedMedium from '../fonts/IBM_Plex_Sans_Condensed/IBMPlexSansCondensed-Regular.ttf'

class Logo extends Component {
  render () {
    return (
      <div className="container mx-auto">
        <div className={this.props.className}>
          <span className="logoA">BOREAL</span><span className="logoB">DIRECTOR</span>
        </div>
      </div>
    )
  }
}

export default hot(module)(Logo)
