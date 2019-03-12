import React from "react"
import PropTypes from "prop-types"
import { ActionCableProvider, ActionCable } from 'actioncable-client-react'

import Layout from './../../Layout/'
import FollowButton from '../FollowButton'
import Post from '../Home/Post'

import profileImage from '../../../../assets/images/profile.png'
import coverImage from '../../../../assets/images/cover.png'

const ProfileView = props => (
  <div className="bg-white rounded">
    {props.user && <div className="p-3 border-b border-primary-lightest flex flex-row justify-between">
      <div>
        <h1>{props.user.name}</h1>
        <h4 className="text-dark-light">@{props.user.username}</h4>
      </div>
      
      {!props.itsMe && <FollowButton user={props.user} />}

    </div>}
  </div>
)

class Show extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      posts: [],
      user: null,
      me: null
    }

    this.fetchUser            = this.fetchUser.bind(this)
    this.fetchMe              = this.fetchMe.bind(this)
    this.handlePostReceived   = this.handlePostReceived.bind(this)
    this.handlePostConnected  = this.handlePostConnected.bind(this)
    this.handleFollow         = this.handleFollow.bind(this)
    this.handleUnfollow       = this.handleUnfollow.bind(this)

    this.handleRemovePost = this.handleRemovePost.bind(this)
    this.handleAppendPost = this.handleAppendPost.bind(this)
    this.handleUpdatePost = this.handleUpdatePost.bind(this)
  }

  componentDidMount() {
    this.fetchUser()
    this.fetchMe()
  }

  handleFollow() {
    $axios.post('/users/follow', { id: this.state.user.id })
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

  handleUnfollow() {
    $axios.delete(`/users/unfollow/${this.state.user.id}`)
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

  handleAppendPost(post) {
    let posts = this.state.user.posts
    posts = [post, ...posts]
    this.setState({
      user: {
        ...this.state.user,
        posts
      }
    })
  }

  handleUpdatePost(updated) {
    let posts = this.state.user.posts
    posts = posts.map(post => {
      if (post.id === updated.id) return updated
      return post
    })
    this.setState({
      user: {
        ...this.state.user,
        posts
      }
    })
  }

  handleRemovePost(id) {
    let posts = this.state.user.posts
    posts = posts.filter(post => post.id !== id)
    this.setState({
      user: {
        ...this.state.user,
        posts
      }
    })
  }

  handlePostReceived({message}) {
    const action = message.action
    const post = JSON.parse(message.post)
    console.log(this.state.user.id, message)

    if (action == 'created')    this.handleAppendPost(post)
    if (action == 'destroyed')  this.handleRemovePost(post.id)
    if (action == 'updated')    this.handleUpdatePost(post)
  } 

  handlePostConnected() {
    console.log('connected')
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

  fetchUser() {
    $axios.get(`/users/${this.props.user.username}`)
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
          <ProfileView
            itsMe={itsMe}
            handleFollow={this.handleFollow}
            handleUnfollow={this.handleUnfollow}
            user={this.state.user}
            me={this.state.me}
            posts={this.state.posts}
            menu={this.state.menu} />

            {this.state.user && this.state.me && this.state.user.posts.map(post => (
              <Post
                key={post.id}
                currentUser={this.state.me}
                itsMe={post.user.id === this.state.me.id}
                user={post.user}
                post={post} />
            ))}
          
          {this.state.user && <ActionCable
            channel={'ProfilePostChannel'}
            room={`${this.state.user.id}`}
            onConnected={this.handlePostConnected}
            onReceived={this.handlePostReceived}></ActionCable>}
      </Layout>
     </React.Fragment>
    )
  }
}

export default Show
