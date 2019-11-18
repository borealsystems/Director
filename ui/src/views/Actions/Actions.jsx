// eslint-disable-next-line no-unused-vars
import React, { Component } from 'react'
import { hot } from 'react-hot-loader'
import lodash from 'lodash/filter'

import Action from './components/Action'
import SearchFilter from './components/SearchFilter'

var uuidBase62 = require('uuid-base62')

class Actions extends Component {
  constructor () {
    super()
    this.state = {
      actions: [{ uuid: '2TV7tt7V7Q2EywFB4JAe42', name: 'Roll Clips' }],
      filteredActions: []
    }
  }

  filter (filterText) {
    console.log(this.state)
    var actions = this.state.actions
    var filteredActions = [{ uuid: '2TV7tt7V7Q2EywFB4JAe42', name: 'Roll Clips' }]
    filteredActions = lodash.filter(actions, { name: filterText })
    console.log(filteredActions)
    this.setState({
      filteredActions
    })
  }

  render () {
    return (
      <div className="w-100">
        <div className="bg-gray-700 text-center font-bold border border-gray-500 border-b-0 rounded-t-lg">
          <div className="inline-block w-3/6 py-2 px-2">Actions</div>
          <div className="inline-block w-1/6 py-2 px-2"></div>
          <div className="inline-block w-1/3 py-2 px-2">
            <SearchFilter onChange={this.filter} actions={this.state.actions}/>
          </div>
        </div>
        <div className="bg-gray-800 text-center font-bold border border-gray-500 border-b-0">
          <div className="inline-block w-3/6 py-2 px-2">Name</div>
          <div className="inline-block w-1/3 py-2 px-2">UUID</div>
          <div className="inline-block w-1/6 py-2 px-2"></div>
        </div>
        <Action name="Sting" uuid={uuidBase62.v4()} index="1"/>
        <Action name="PreRoll" uuid={uuidBase62.v4()} index="2"/>
        <Action name="FTB" uuid={uuidBase62.v4()} index="3"/>
        <Action name="RollClip" uuid={uuidBase62.v4()} index="4"/>
        <Action name="Ad Break" uuid={uuidBase62.v4()} index="5"/>
        <Action name="Start Record" uuid={uuidBase62.v4()} index="6"/>
        <Action name="Stop Record" uuid={uuidBase62.v4()} index="7"/>
        <Action name="Network Bug" uuid={uuidBase62.v4()} index="8"/>
        <div className="bg-gray-700 text-center font-bold border border-gray-500 rounded-b-lg">
          <div className="inline-block w-5/6 py-2 px-2"></div>
          <div className="inline-block w-1/6 ">
            <button className="bg-indigo-900 py-2 px-2 ml-px h-10 rounded-br-lg border-l border-r border-gray-500 w-full">New</button>
          </div>
        </div>
      </div>
    )
  }
}

export default hot(module)(Actions)
