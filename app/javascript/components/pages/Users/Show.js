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
      {!props.itsMe && <button className="btn primary absolute self-end">
        Follow
      </button>}
    </div>}
    <div className="p-3">
      Publications
    </div>
  </div>
)

class Show extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      posts: [],
      user: null
    }

    this.fetchUser = this.fetchUser.bind(this)
    this.fetchPosts = this.fetchPosts.bind(this)
    this.handlePostReceived = this.handlePostReceived.bind(this)
    this.handlePostConnected = this.handlePostConnected.bind(this)
  }

  componentDidMount() {
    this.fetchUser()
    this.fetchMe()
    this.fetchPosts()
  }

  handlePostReceived(post) {
    this.fetchPosts()
    console.log('received')
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

  fetchPosts() {
    $axios.get('/posts.json')
      .then(({data}) => {
        this.setState({
          posts: data.posts
        })
      })
      .catch(err => {
        this.showErrors([err])
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
    const itsMe = this.state.user && this.state.me && this.state.user.id === this.state.me.id
    return (
      <React.Fragment>
        <Layout user={this.state.user}>
          <ActionCableProvider url={`ws://${window.location.host}/cable`}>
            <HomeView
              itsMe={itsMe}
              user={this.state.user}
              posts={this.state.posts}
              menu={this.state.menu} />
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
