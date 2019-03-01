import React from "react"
import PropTypes from "prop-types"

import logo from '../../../assets/images/logo_h.svg'

const Form = props => (
  <React.Fragment>
    <div className="flex mx-auto h-full bg-image bg-primary-lightest">
      <div className="flex flex-col w-full items-center justify-center">
        <div className="card flex flex-col p-8 w-1/4 justify-center">
          <img className="pb-8" alt="Twidown" src={props.logo} />

          <form onSubmit={props.handleSubmit}>
            <div>
              <label htmlFor="username">Username</label>
              <input type="text" name="username" className="input" onChange={e => props.handleUsernameChange(e.target.value)} placeholder="Username" />
            </div>

            <div>
              <label htmlFor="password">Password</label>
              <input type="password" name="password" className="input" onChange={e => props.handlePasswordChange(e.target.value)} placeholder="Password" />
            </div>

            <button type="submit" className="btn primary py-4 mt-2 w-full">LOGIN</button>
          </form>

          <div className="text-dark-light pt-4">
            Or if you don't have an account, <a href="/users/sign_up">sign up</a>!
          </div>
        </div>
      </div>
    </div>
  </React.Fragment>
)

class SignIn extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      logo: null,
      user: {
        username: '',
        password: ''
      }
    }

    this.showErrors                         = this.showErrors.bind(this)
    this.handleSubmit                       = this.handleSubmit.bind(this)
    this.handleUsernameChange               = this.handleUsernameChange.bind(this)
    this.handlePasswordChange               = this.handlePasswordChange.bind(this)
  }

  handleUsernameChange(username) {
    this.setState({
      user: {
        ...this.state.user,
        username
      }
    })
  }

  handlePasswordChange(password) {
    this.setState({
      user: {
        ...this.state.user,
        password 
      }
    })
  }

  handleSubmit(e) {
    e.preventDefault()
    $axios.post('/users/login', { user: this.state.user })
      .then(({data}) => {
        console.log(data)
        if (data.status === 200) {
          window.location = '/'
        } else {
          this.showErrors(data.errors)
        }
      })
      .catch(error => {
        this.showErrors(error)
      })
  }

  showErrors(errors) {
    const errorsHTML = errors.map(err => `<li>${err}</li>`).join('')
    $swal.fire({
      type: 'info',
      title: 'Wrong crendentials',
      html: `<ul>${errorsHTML}</ul>`
    })
  }

  render () {
    return (
      <Form
        logo={logo}
        handleUsernameChange={this.handleUsernameChange}
        handlePasswordChange={this.handlePasswordChange}
        handleSubmit={this.handleSubmit} /> 
    )
  }
}

export default SignIn
