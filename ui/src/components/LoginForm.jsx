// eslint-disable-next-line no-unused-vars
import React, { Component } from 'react'
import { hot } from 'react-hot-loader'

class LoginForm extends Component {
  render () {
    return (
      <div className="container mx-auto bg-gray-200 w-1/3 py-10 rounded-lg">
        <form className="" action="action_page.php" method="post">
          <input className="text-input" type="text" placeholder="Username" name="uname" required />
          <br />
          <input className="text-input" type="password" placeholder="Password" name="psw" required />
          <br />
          <button className="btn btn-blue mt-2" type="submit" >Login</button>
        </form>
      </div>
    )
  }
}

export default hot(module)(LoginForm)
