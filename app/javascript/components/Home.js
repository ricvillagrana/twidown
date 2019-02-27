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
        Home
      </React.Fragment>
    );
  }
}

Home.propTypes = {
};
export default Home
