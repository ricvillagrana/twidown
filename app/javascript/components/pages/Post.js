import React from "react"
import PropTypes from "prop-types"
import renderHTML from 'react-render-html'

const UserInfo = props => (
  <React.Fragment>
    {props.user && <div>
      <div className="flex items-center mb-2">
        <img src={props.user.profile_image} className="h-12 w-12 rounded-full" />
    	<div className="flex flex-col ml-4">
          <a className="font-bold text-black" href={`/users/${props.user.username}`}>{props.user.name}</a>
          <span className="text-grey">@{props.user.username}</span>
      	</div>
      </div> 
    </div>}
  </React.Fragment>
)

const PostControls = props => (
  <React.Fragment>
    <div className="flex flex-row justify-around mt-3">
      <a>Comment</a>
      <a>Repost</a>
      <a>Like</a>
    </div>
  </React.Fragment>
)

class Post extends React.Component {

  constructor(props) {
    super(props)
  }

  render () {
    const props = this.props
    return (
      <React.Fragment>
        <div className="bg-white p-5 border-t border-solid border-primary-lightest flex flex-col">
          <UserInfo user={props.user} />
          {renderHTML(props.content)}
          <PostControls />
        </div>
      </React.Fragment>
    );
  }
}

export default Post
