// eslint-disable-next-line no-unused-vars
import React, { Component } from 'react'
import { hot } from 'react-hot-loader'
import Logo from '../components/Logo.jsx'

class Login extends Component {
  constructor (props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
    this.state = {}
  }

  handleChange () {
    this.props.handleChange(1)
  }

  render () {
    return (
      <div className="container mx-auto w-100">
        <Logo className="text-center text-6xl"/>
        <div className="block text-gray-700 text-center w-full">
          <div className="container mx-auto bg-gray-200 w-1/3 py-10 rounded-lg">
            <input className="text-input" type="username" placeholder="Username" name="usr" required onChange = {(event, newValue) => this.setState({ username: newValue })} />
            <br />
            <input className="text-input" type="password" placeholder="Password" name="psw" required onChange = {(event, newValue) => this.setState({ password: newValue })}/>
            <br />
            <button className="btn btn-blue mt-6" type="submit" onClick={(event) => this.handleClick(event)}>Login</button>
          </div>
        </div>
      </div>
    )
  }
}

export default hot(module)(Login)
