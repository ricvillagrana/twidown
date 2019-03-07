import React from "react"
import PropTypes from "prop-types"

import logo from '../../../assets/images/logo_h.svg'

const Menu = props => (
  <div className="flex flex-col items-end mr-8">
    {props.user && <p className="text-dark cursor-pointer" onClick={props.handleToggleMenu}>
    <img className="h-8 w-8 rounded-full" src={props.user.profile_image} alt={props.user.username} />
    </p>}
    <div className={`card fixed mt-12 py-2 w-32 ${(props.open ? 'block' : 'hidden')}`}>
      {props.user && <a href={`/users/${props.user.username}`}>
        <p className="py-2 px-4 hover:bg-primary hover:text-white">
          <i className="fa fa-user"></i>
          Profile
        </p>
      </a>}

      <hr className="border-solid border-t border-dark-lightest" />

      <a data-method="delete" href="/users/sign_out">
        <p className="py-2 px-4 text-red hover:bg-primary hover:text-white">
          <i className="fa fa-sign-out"></i>
          Log out
        </p>
      </a>
    </div>
  </div>
)

class TopBar extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      menuOpened: false
    }

    this.handleToggleMenu = this.handleToggleMenu.bind(this)
  }

  handleToggleMenu() {
    this.setState({
      menuOpened: !this.state.menuOpened
    })
  }

  render () {
    return (
      <React.Fragment>
        <div className="card flex flex-row justify-between items-center w-full p-2">
          <div className="flex flex-row items-center">
            <p className="pr-8">
              <a href="/">
                <img className="h-6" alt="Twidown" src={logo} />
              </a>
            </p>
            {this.props.menuList.map(item => 
              <p key={item.label} className="pr-8">
                <a href={item.link}>
                  <i className={item.icon}></i>
                  {item.label}
                </a>
              </p>
            )}
          </div>
          <div className="flex">
            <Menu
              open={this.state.menuOpened}
              handleToggleMenu={this.handleToggleMenu}
              user={this.props.user} />
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default TopBar
