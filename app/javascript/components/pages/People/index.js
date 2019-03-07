import React from "react"
import PropTypes from "prop-types"
import { ActionCableProvider, ActionCable } from 'actioncable-client-react'

import Layout from './../../Layout/'

import profileImage from '../../../../assets/images/profile.png'
import coverImage from '../../../../assets/images/cover.png'

const HomeView= props => (
  <div className="bg-white rounded">
    {props.user && <div className="p-3 border-b border-primary-lightest flex flex-col justify-center">
      <h1>{props.user.name}</h1>
      <h4 className="text-dark-light">@{props.user.username}</h4>
      
      {!props.itsMe && <FollowButton
        handleFollow={props.handleFollow(props.user.id)}
        handleUnfollow={props.handleUnfollow(props.user.id)}
        me={props.me}
        user={props.user} />}

    </div>}
  </div>
)

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
      {props.me && <FollowButton
      handleFollow={() => props.handleFollow(props.user.id)}
      handleUnfollow={() => props.handleUnfollow(props.user.id)}
        me={props.me}
        user={props.user} />}
    </div>
  </div>
)

const FollowButton = props => (
  <React.Fragment>
    {props.me && props.me.following_ids.some(id => id === props.user.id) ? 
    <button 
      onClick={(id) => props.handleUnfollow(id)}
      className="btn red">
      Unfollow
    </button>
    : 
    <button 
      onClick={(id) => props.handleFollow(id)}
      className="btn primary">
      Follow
    </button>}
  </React.Fragment>
)

class Show extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      users: [],
      me: null
    }

    this.fetchUsers           = this.fetchUsers.bind(this)
    this.fetchMe              = this.fetchMe.bind(this)
    this.handleFollow         = this.handleFollow.bind(this)
    this.handleUnfollow       = this.handleUnfollow.bind(this)
  }

  componentDidMount() {
    this.fetchUsers()
    this.fetchMe()
  }

  handleFollow(id) {
    $axios.post('/users/follow', { id })
      .then(({data}) => {
        if (data.status === 200) {
          this.setState({
            me: {
              ...this.state.me,
              following_ids: [
                data.followed.id,
                ...this.state.me.following_ids
              ]
            }
          })
        } else {
          this.showErrors(data.errors)
        }
      })
      .catch(err => this.showErrors([err]))
  }

  handleUnfollow(id) {
    $axios.delete(`/users/unfollow/${id}`)
      .then(({data}) => {
        if (data.status === 200) {
          let following_ids = this.state.me.following_ids.filter(id => id !== data.unfollowed.id)
          this.setState({
            me: {
              ...this.state.me,
              following_ids
            }
          })
        } else {
          this.showErrors(data.errors)
        }
      })
      .catch(err => this.showErrors([err]))
  }
 
  fetchMe() {
    $axios.get('/users/me')
      .then(({data}) => {
        const user = data.user
        if (!user.profile_image) user.profile_image = profileImage
        if (!user.cover_image) user.cover_image = coverImage

        this.setState({
          me: user
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
    const itsMe = this.state.user && this.state.me && this.state.user.id === this.state.me.id
    return (
      <React.Fragment>
        <Layout user={this.state.user}>
          <ActionCableProvider url={`ws://${window.location.host}/cable`}>
            <div className="flex flex-col bg-white rounded p-3">
              {this.state.users.map(user => <UserCard
              handleFollow={this.handleFollow}
              handleUnfollow={this.handleUnfollow}
              me={this.state.me}
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
