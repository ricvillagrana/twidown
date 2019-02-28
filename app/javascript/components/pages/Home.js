import React from "react"
import PropTypes from "prop-types"

import TopBar from './TopBar'

const Feed = props => (
  <div className="flex flex-col h-full bg-grey-lighter">
    <TopBar
      user={props.user}
      menuList={props.menu} />  
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
