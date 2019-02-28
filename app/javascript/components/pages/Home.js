import React from "react"
import PropTypes from "prop-types"

import TopBar from './TopBar'
import InfoCard from './InfoCard'
import NewPost from './NewPost'
import Post from './Post'

import profileImage from '../../../assets/images/profile.png'
import coverImage from '../../../assets/images/cover.png'

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
        <NewPost />
        <Post user={props.user} content={"Any other text <div class='markdown-parser'><h1>Title</h1><p>this is a text that has a <strong>bold</strong> text and <em>italics</em></p><p>Know more here <a href='img_url'><img src='https://pbs.twimg.com/media/D0dmgnVWoAEv5C2.jpg' alt='alt' /></a></p></div>"} />
        <Post user={props.user} content={"Any other text <div class='markdown-parser'><h1>Title</h1><p>this is a text that has a <strong>bold</strong> text and <em>italics</em></p><p>Know more here <a href='img_url'><img src='https://pbs.twimg.com/media/D0dmgnVWoAEv5C2.jpg' alt='alt' /></a></p></div>"} />

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
        { label: 'Home', link: '/' },
        { label: 'People', link: '/' },
        { label: 'Options', link: '/' }
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

  render () {
    return (
      <React.Fragment>
        <HomeView
          user={this.state.user}
          menu={this.state.menu} />
      </React.Fragment>
    )
  }
}

export default Home
