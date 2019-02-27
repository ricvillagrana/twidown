import React from "react"
import PropTypes from "prop-types"

import logo from '../../../assets/images/logo_h.svg'

const Form = props => (
  <React.Fragment>
    <div className="flex mx-auto h-full bg-image bg-primary-lightest">
      <div className="flex flex-col w-full items-center justify-center">
        <div className="card flex flex-col p-8 w-1/3 justify-center">
          <img className="pb-8" alt="Twidown" src={props.logo} />

          <h2 className="pb-3 self-center">
            Registration
          </h2>
          
          <form onSubmit={props.handleSubmit}>
            <div>
              <label htmlFor="username">Username</label>
              <input type="text" name="username" className="input" onChange={e => props.handleUsernameChange(e.target.value)} placeholder="Username" />
            </div>

            <div>
              <label htmlFor="name">Full name</label>
              <input type="text" name="name" className="input" onChange={e => props.handleNameChange(e.target.value)} placeholder="Full name" />
            </div>

            <div>
              <label htmlFor="email">Email</label>
              <input type="email" name="email" className="input" onChange={e => props.handleEmailChange(e.target.value)} placeholder="Email" />
            </div>

            <div>
              <label htmlFor="password">Password</label>
              <input type="password" name="password" className="input" onChange={e => props.handlePasswordChange(e.target.value)} placeholder="Password" />
              <label htmlFor="password_confirmation">Password confirmation</label>
              <input type="password" name="password_confirmation" className="input" onChange={e => props.handlePasswordConfirmationChange(e.target.value)} placeholder="Password confirmation" />
            </div>

            <button type="submit" className="btn primary py-4 mt-2 w-full">REGISTER</button>
          </form>

          <div className="text-dark-light pt-4">
            Or if you already have an account, just <a href="/users/sign_in">sign in</a>!
          </div>
        </div>
      </div>
    </div>
  </React.Fragment>
)

class SignUp extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      logo: null,
      user: {
        username: '',
        name: '',
        password: '',
        password_confirmation: '',
        email: ''
      }
    }

    this.signUp                             = this.signUp.bind(this)
    this.showErrors                         = this.showErrors.bind(this)
    this.handleSubmit                       = this.handleSubmit.bind(this)
    this.handleUsernameChange               = this.handleUsernameChange.bind(this)
    this.handleNameChange                   = this.handleNameChange.bind(this)
    this.handlePasswordChange               = this.handlePasswordChange.bind(this)
    this.handlePasswordConfirmationChange   = this.handlePasswordConfirmationChange.bind(this)
    this.handleEmailChange                  = this.handleEmailChange.bind(this)
  }

  signUp() {
    $axios.post('/users/register', credentials)
      .bind(this)
      .then(response => {
        // handle response
      })
  }

  handleUsernameChange(username) {
    this.setState({
      user: {
        ...this.state.user,
        username
      }
    })
  }

  handleNameChange(name) {
    this.setState({
      user: {
        ...this.state.user,
        name
      }
    })
  }

  handleEmailChange(email) {
    this.setState({
      user: {
        ...this.state.user,
        email 
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

  handlePasswordConfirmationChange(password_confirmation) {
    this.setState({
      user: {
        ...this.state.user,
        password_confirmation
      }
    })
  }

  handleSubmit(e) {
    e.preventDefault()
    $axios.post('/users/register', {user: this.state.user})
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
    console.log(errorsHTML)
    $swal.fire({
      type: 'warning',
      title: 'Some errors were found',
      html: `Please check the following advices: <ul>${errorsHTML}</ul>`
    })
  }

  render () {
    return (
      <Form
        logo={logo}
        handleUsernameChange={this.handleUsernameChange}
        handleNameChange={this.handleNameChange}
        handleEmailChange={this.handleEmailChange}
        handlePasswordChange={this.handlePasswordChange}
        handlePasswordConfirmationChange={this.handlePasswordConfirmationChange}
        handleSubmit={this.handleSubmit} /> 
    )
  }
}

export default SignUp
