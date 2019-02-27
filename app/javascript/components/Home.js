import React from "react"
import PropTypes from "prop-types"

const Feed = props => (
  <div>
    This is the Feed
  </div>
)

class Home extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      isLogged: false
    }
  }

  render () {
    return (
      <React.Fragment>
        { isLogged ? <Feed /> : <Login /> } 
      </React.Fragment>
    );
  }
}

Home.propTypes = {
  isLogged: PropTypes.string
};
export default Home
