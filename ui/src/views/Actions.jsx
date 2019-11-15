// eslint-disable-next-line no-unused-vars
import React, { Component } from 'react'
import { hot } from 'react-hot-loader'

import Action from '../components/Action'

class Actions extends Component {
  render () {
    return (
      <div className="w-100">
        <div className="bg-gray-700 text-center font-bold border border-gray-500 border-b-0 rounded-t-lg">
          <div className="inline-block w-3/6 py-2 px-2">Name</div>
          <div className="inline-block w-1/3 py-2 px-2">UUID</div>
          <div className="inline-block w-1/6 py-2 px-2"></div>
        </div>
        <Action />
        <Action />
        <Action />
        <Action />
        <Action />
        <Action />
        <Action />
        <Action />
        <Action />
        <div className="bg-gray-700 text-center font-bold border border-gray-500 rounded-b-lg">
          <div className="inline-block w-5/6 py-2 px-2"></div>
          <div className="inline-block w-1/6 py-2 px-2"><button className="bg-indigo-900 py-1 px-5 rounded">New</button></div>
        </div>
      </div>
    )
  }
}

export default hot(module)(Actions)
