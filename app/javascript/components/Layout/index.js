import React from "react"
import PropTypes from "prop-types"
import { ActionCableProvider, ActionCable } from 'actioncable-client-react'

import TopBar from './TopBar'
import InfoCard from './InfoCard'

import profileImage from '../../../assets/images/profile.png'
import coverImage from '../../../assets/images/cover.png'

class Home extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      menu: [
        { label: 'Home', icon: 'fa fa-home', link: '/' },
        { label: 'People', icon: 'fa fa-users', link: '/people' },
        { label: 'Options', icon: 'fa fa-cogs', link: '/' }
      ],
      user: null
    }

    this.fetchUser = this.fetchUser.bind(this)
  }

  componentDidMount() {
    this.fetchUser()
  }

  fetchUser() {
    $axios.get('/users/me')
      .then(({data}) => {
        const user = data.user
        if (!user.profile_image) user.profile_image = profileImage
        if (!user.cover_image) user.cover_image = coverImage

        this.setState({
          user
        })
      })
      .catch(err => {
        $toast({
          type: 'error',
          title: 'Error',
          text: 'Error on fetch user info.'
        })
      })
  }

  showErrors(errors) {
    const errorsHTML = errors.map(err => `<li>${err}</li>`).join('')
    $swal.fire({
      type: 'error',
      title: 'Error',
      html: `<ul>${errorsHTML}</ul>`
    })
  }

  render() {
    return (
      <React.Fragment>
        <div className="flex flex-col mb-4">
          <TopBar
            user={this.state.user}
            menuList={this.state.menu} />  
          <div className="flex flex-row justify-arround w-full mt-4 mb-8">
            <div className="flex flex-col w-1/6"></div>
            <div className="flex flex-col w-1/6 px-2">
              <InfoCard user={this.props.user ? this.props.user : this.state.user} />
            </div>
            <div className="flex flex-col w-1/3 px-2">
              {this.props.children} 
            </div>
            <div className="flex flex-col w-1/6 px-2"></div>
            <div className="flex flex-col w-1/6"></div>
          </div>
        </div>
      </React.Fragment>
    )
  }
}

export default Home
