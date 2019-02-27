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
   
  }

  render () {
    return (
      <React.Fragment>
        <a className="btn primary" data-method="delete" href="/users/sign_out">
          Cerrar sesión
        </a>
      </React.Fragment>
    );
  }
}

Home.propTypes = {}
export default Home
