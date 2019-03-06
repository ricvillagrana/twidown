import React from "react"
import PropTypes from "prop-types"
import { ActionCableProvider, ActionCable } from 'actioncable-client-react'

import Layout from './../../Layout/'
import NewPost from './NewPost'
import Post from './Post'

import profileImage from '../../../../assets/images/profile.png'
import coverImage from '../../../../assets/images/cover.png'

const HomeView= props => (
  <React.Fragment>
    <NewPost handleUpdateFeed={props.handleUpdateFeed} />

    {props.posts.map(post => (
      <Post key={post.id} user={post.user} content={post.content} date={post.created_at} />
    ))}

    <div className="bg-white p-5 rounded-b border-t border-solid border-primary-lightest flex justify-center">
      <a href="#up">Go up</a>
    </div>
  </React.Fragment>
)

class Home extends React.Component {

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
    this.fetchPosts()
  }

  handlePostReceived(post) {
    this.fetchPosts()
    console.log('received')
  } 

  handlePostConnected() {
    console.log('connected')
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
    return (
      <React.Fragment>
        <Layout>
          <ActionCableProvider url={`ws://${window.location.host}/cable`}>
            <HomeView
              user={this.state.user}
              posts={this.state.posts}
              menu={this.state.menu}
              handleUpdateFeed={this.fetchUser} />
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

export default Home
