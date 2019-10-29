// eslint-disable-next-line no-unused-vars
import React, { Component } from 'react'
import { hot } from 'react-hot-loader'
import Hero from '../components/Hero.jsx'

class Login extends Component {
  render () {
    return (
      <div className="container mx-auto">
        <div className="p-10">
          <Hero />
          <div className="block text-gray-700 text-center px-4 py-1 mt-2">
            <form action="action_page.php" method="post">
              <div className="container">
                <input className="px-4 py-1 mt-2" type="text" placeholder="Username" name="uname" required />
                <br />
                <input className="px-4 py-1 mt-2" type="password" placeholder="Password" name="psw" required />
                <br /><br />
                <button className="btn btn-blue" type="submit" >Login</button>
                <br /><br />
                <label>
                  <input type="checkbox" checked="onChange" name="remember" /> Remember me
                </label>
              </div>
              <br />
              <span className="psw"><a href="#">Forgot password?</a></span>
            </form>
          </div>
        </div>
      </div>
    )
  }
}

export default hot(module)(Login)
