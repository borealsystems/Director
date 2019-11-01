// eslint-disable-next-line no-unused-vars
import React, { Component } from 'react'
import { hot } from 'react-hot-loader'
import Hero from '../components/LoginHero.jsx'
import LoginForm from '../components/LoginForm.jsx'

class Login extends Component {
  render () {
    return (
      <div className="container mx-auto w-100">
        <div className="object-center">
          <Hero />
          <div className="block text-gray-700 text-center w-full">
            <LoginForm />
          </div>
        </div>
      </div>
    )
  }
}

export default hot(module)(Login)
