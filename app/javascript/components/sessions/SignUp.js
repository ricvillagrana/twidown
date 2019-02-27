import React from "react"
import PropTypes from "prop-types"

import logo from '../../../assets/images/logo_h.svg'

class SignUp extends React.Component {
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

              <h2 className="pb-3 self-center">
                Registration
              </h2>

              <div>
                <label htmlFor="username">Username</label>
                <input type="text" name="username" className="input" placeholder="Username" />
              </div>

              <div>
                <label htmlFor="name">Full name</label>
                <input type="text" name="name" className="input" placeholder="Full name" />
              </div>

              <div>
                <label htmlFor="email">Email</label>
                <input type="email" name="email" className="input" placeholder="Email" />
              </div>

              <div>
                <label htmlFor="password">Password</label>
                <input type="password" name="password" className="input" placeholder="Password" />
                <label htmlFor="password_confirmation">Password confirmation</label>
                <input type="password" name="password_confirmation" className="input" placeholder="Password confirmation" />
              </div>

              <a className="btn primary py-3">REGISTER</a> 

              <div className="text-dark-light pt-4">
                Or if you already have an account, just <a href="/users/sign_in">sign in</a>!
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default SignUp
