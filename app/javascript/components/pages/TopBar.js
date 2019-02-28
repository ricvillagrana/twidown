import React from "react"
import PropTypes from "prop-types"

import logo from '../../../assets/images/logo_h.svg'

const Menu = props => (
  <div className="flex flex-col items-end">
    <p className="text-dark cursor-pointer" onClick={props.handleToggleMenu}>{props.user && props.user.name}</p>
    <div className={`card fixed mt-10 mx-2 py-2 w-1/6 ${(props.open ? 'block' : 'hidden')}`}>
      <a href="/"><p className="py-2 px-4 hover:bg-primary hover:text-white">Profile</p></a>

      <hr className="border-solid border-t border-dark-lightest" />

      <a data-method="delete" href="/users/sign_out"><p className="py-2 px-4 text-red hover:bg-primary hover:text-white">Log out</p></a>
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
        <div className="card flex flex-row justify-between w-full p-4">
          <div className="flex flex-row">
            <p className="pr-8">
              <a href="/">
                <img className="h-4" alt="Twidown" src={logo} />
              </a>
            </p>
            {this.props.menuList.map(item => 
              <p key={item.label} className="pr-8">
                <a herf={item.link}>{item.label}</a>
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
