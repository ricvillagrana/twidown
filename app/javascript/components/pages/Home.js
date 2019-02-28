import React from "react"
import PropTypes from "prop-types"

import TopBar from './TopBar'
import InfoCard from './InfoCard'

const Feed = props => (
  <div className="flex flex-col h-full">
    <TopBar
      user={props.user}
      menuList={props.menu} />  
    <div className="flex flex-row justify-arround w-full mt-6">
      <div className="flex flex-col w-1/6"></div>
      <div className="flex flex-col w-1/6 px-2">
        <InfoCard user={props.user} />
      </div>
      <div className="flex flex-col w-1/3 px-2">Feed</div>
      <div className="flex flex-col w-1/6 px-2">Ads</div>
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
        this.setState({
          user: data.user
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
        <Feed 
          user={this.state.user}
          menu={this.state.menu} />
      </React.Fragment>
    )
  }
}

export default Home
