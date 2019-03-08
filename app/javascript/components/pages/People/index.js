import React from "react"
import PropTypes from "prop-types"
import { ActionCableProvider, ActionCable } from 'actioncable-client-react'

import Layout from './../../Layout/'
import FollowButton from '../FollowButton'

import profileImage from '../../../../assets/images/profile.png'
import coverImage from '../../../../assets/images/cover.png'

const UserCard = props => (
  <div className="flex flex-row justify-between items-center">
    <div className="flex mb-2">
      <img src={ props.user.profile_image || profileImage } className="h-12 w-12 rounded-full" />
      <div className="flex flex-col ml-4">
        <a className="font-bold text-black" href={`/users/${props.user.username}`}>{props.user.name}</a>
        <a className="text-grey" href={`/users/${props.user.username}`}>@{props.user.username}</a>
      </div>
    </div>
    <div className="flex">
      <FollowButton user={props.user} />
    </div>
  </div>
)

class Show extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      users: [],
    }

    this.fetchUsers           = this.fetchUsers.bind(this)
  }

  componentDidMount() {
    this.fetchUsers()
  }


  fetchUsers() {
    $axios.get(`/users.json`)
      .then(({data}) => {
        const users = data.users.map(user => {
          if (!user.profile_image) user.profile_image = profileImage
          if (!user.cover_image) user.cover_image = coverImage
          return user
        })
        this.setState({
          users
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
    console.log(errors)
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
        <Layout user={this.state.user}>
          <ActionCableProvider url={$actioncableURL}>
            <div className="flex flex-col bg-white rounded p-3">
              {this.state.users.map(user => <UserCard
              handleFollow={this.handleFollow}
              handleUnfollow={this.handleUnfollow}
              key={user.id}
              user={user} />)}
            </div>

            {this.state.user && <ActionCable
              channel={'PostChannel'}
              room={`${this.state.user.id}`}
              onConnected={this.handlePostConnected}
              onReceived={this.handlePostReceived}></ActionCable>}
          </ActionCableProvider>
        </Layout>
     </React.Fragment>
    )
  }
}

export default Show
