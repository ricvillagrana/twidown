import React from "react"
import PropTypes from "prop-types"

import profileImage from '../../../assets/images/profile.png'
import coverImage from '../../../assets/images/cover.png'

class InfoCard extends React.Component {
  constructor(props) {
    super(props)
  }

  render () {
    const props = this.props
    return (
      <React.Fragment>
        {props.user && <div className="overflow-hidden rounded bg-white max-w-xs">
          <img src={ props.user.cover_image ? props.user.cover_image : coverImage } className="w-full" />
          <div className="flex justify-center -mt-8">
            <img src={ props.user.profile_image ? props.user.profile_image : profileImage } className="profile-pic-size rounded-full border-solid border-white border-2 -mt-3" />
          </div>
          <div className="text-center px-3 pb-6 pt-2">
            <h3 className="text-2xl">{props.user.name}</h3>
            <p className="mt-2 font-sans font-light text-primary-light">@{props.user.username}</p>
          </div>
          <div className="flex justify-center pb-3">
            <div className="text-center mr-3 border-r pr-3">
              <h3>34</h3>
              <span>Followers</span>
            </div>
            <div className="text-center">
              <h3>42</h3>
              <span>Posts</span>
            </div>
          </div>
        </div>}
      </React.Fragment>
    );
  }
}

export default InfoCard
