// eslint-disable-next-line no-unused-vars
import React, { Component } from 'react'
import { hot } from 'react-hot-loader'

class SearchFilter extends Component {
  constructor (props) {
    super(props)
    this.state = {
      searchFilter: ''
    }
  }

  handleChange (event) {
    console.log(event)
    this.state = {
      searchFilter: event.target.value
    }
    this.props.onChange(event.target.value)
  }

  componentDidMount () {
    this.setState(this.props.actions)
    console.log(this.state)
  }

  render () {
    return (
      <input className="shadow appearance-none border border-gray-500 rounded bg-gray-700 w-full py-2 px-3 text-white leading-tight focus:outline-none focus:border-white"
        type="text"
        id="filter"
        value={this.state.searchFilter}
        onChange={this.handleChange.bind(this)} placeholder="Search" />
    )
  }
}

export default hot(module)(SearchFilter)
