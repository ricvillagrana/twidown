import React from "react"
import PropTypes from "prop-types"

class InfoCard extends React.Component {
  constructor(props) {
    super(props)
  }

  render () {
    const props = this.props
    return (
      <React.Fragment>
        {props.user && <div className="overflow-hidden rounded bg-white max-w-xs">
          <img src={ props.user.cover_image } className="w-full" />
          <div className="flex justify-center -mt-8">
            <img src={ props.user.profile_image } className="profile-pic-size rounded-full border-solid border-white border-2 -mt-3" />
          </div>
          <div className="text-center px-3 pb-6 pt-2">
            <a href={`/users/${props.user.username}`}>
              <h3 className="text-2xl">{props.user.name}</h3>
              <p className="mt-2 font-sans font-light text-primary-light">@{props.user.username}</p>
            </a>
          </div>
          <div className="flex justify-center pb-3">
            <div className="text-center mr-3 border-r pr-3">
              <h3>{props.user.followers_count}</h3>
              <span>Followers</span>
            </div>
            <div className="text-center">
              <h3>{props.user.following_count}</h3>
              <span>Posts</span>
            </div>
          </div>
        </div>}
      </React.Fragment>
    );
  }
}

export default InfoCard
