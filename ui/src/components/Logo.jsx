// eslint-disable-next-line no-unused-vars
import React, { Component } from 'react'
import { hot } from 'react-hot-loader'

// eslint-disable-next-line no-unused-vars
import IBMPlexSansCondensedLight from '../fonts/IBM_Plex_Sans_Condensed/IBMPlexSansCondensed-ExtraLight.ttf'
// eslint-disable-next-line no-unused-vars
import IBMPlexSansCondensedMedium from '../fonts/IBM_Plex_Sans_Condensed/IBMPlexSansCondensed-Regular.ttf'

const Logo = (props) => {
  return (
    <div className="container mx-auto">
      <div className={props.className}>
        <span className="logoA">BOREAL</span><span className="logoB">DIRECTOR</span>
      </div>
    </div>
  )
}

export default hot(module)(Logo)
