import React from "react"
import PropTypes from "prop-types"
import { ActionCableProvider, ActionCable } from 'actioncable-client-react'

import TopBar from './TopBar'
import InfoCard from './InfoCard'
import NewPost from './NewPost'
import Post from './Post'

import profileImage from '../../../../assets/images/profile.png'
import coverImage from '../../../../assets/images/cover.png'

const HomeView= props => (
  <div className="flex flex-col mb-4">
    <TopBar
      user={props.user}
      menuList={props.menu} />  
    <div className="flex flex-row justify-arround w-full mt-4 mb-8">
      <div className="flex flex-col w-1/6"></div>
      <div className="flex flex-col w-1/6 px-2">
        <InfoCard user={props.user} />
      </div>
      <div className="flex flex-col w-1/3 px-2">
        <NewPost handleUpdateFeed={props.handleUpdateFeed} />

        {props.posts.map(post => (
          <Post
            emitDeletion={() => props.handleRemovePost(post.id)}
            key={post.id}
            itsMe={post.user.id === props.user.id}
            user={post.user}
            post={post} />
        ))}

        <div className="bg-white p-5 rounded-b border-t border-solid border-primary-lightest flex justify-center">
          <a href="#up">Go up</a>
        </div>
      </div>
      <div className="flex flex-col w-1/6 px-2"></div>
      <div className="flex flex-col w-1/6"></div>
    </div>
  </div>
)

class Home extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      menu: [
        { label: 'Home', icon: 'fa fa-home', link: '/' },
        { label: 'People', icon: 'fa fa-users', link: '/' },
        { label: 'Options', icon: 'fa fa-cogs', link: '/' }
      ],
      posts: [],
      user: null
    }

    this.fetchUser = this.fetchUser.bind(this)
    this.fetchPosts = this.fetchPosts.bind(this)
    this.handlePostReceived = this.handlePostReceived.bind(this)
    this.handlePostConnected = this.handlePostConnected.bind(this)
    this.handleRemovePost = this.handleRemovePost.bind(this)
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

  handleRemovePost(id) {
    let posts = this.state.posts
    posts = posts.filter(post => post.id !== id)
    this.setState({ posts })
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
        <ActionCableProvider url={`ws://${window.location.host}/cable`}>
          <HomeView
            user={this.state.user}
            posts={this.state.posts}
            menu={this.state.menu}
            handleRemovePost={this.handleRemovePost}
            handleUpdateFeed={this.fetchUser} />
          {this.state.user && <ActionCable
            channel={'PostChannel'}
            room={`${this.state.user.id}`}
            onConnected={this.handlePostConnected}
            onReceived={this.handlePostReceived}></ActionCable>}
        </ActionCableProvider>
     </React.Fragment>
    )
  }
}

export default Home
