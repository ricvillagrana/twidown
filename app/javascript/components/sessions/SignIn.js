import React from "react"
import PropTypes from "prop-types"

import logo from '../../../assets/images/logo_h.svg'

class SignIn extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      logo: null
    }
  }

  render () {
    return (
      <React.Fragment>
        <div className="flex mx-auto h-full bg-image bg-primary-lightest">
          <div className="flex flex-col w-full items-center justify-center">
            <div className="card flex flex-col p-8 w-1/3 justify-center">
              <img className="pb-8" alt="Twidown" src={logo} />

              <div>
                <label htmlFor="username">Username</label>
                <input type="username" name="username" className="input" placeholder="Username" />
              </div>

              <div>
                <label htmlFor="password">Password</label>
                <input type="password" name="password" className="input" placeholder="Password" />
              </div>

              <a className="btn primary py-3">LOGIN</a> 

              <div className="text-dark-light pt-4">
                Create a account <a href="/users/sign_up">here</a>!
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default SignIn
