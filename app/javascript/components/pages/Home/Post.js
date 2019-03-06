import React from "react"
import PropTypes from "prop-types"
import renderHTML from 'react-render-html'

import profileImage from '../../../../assets/images/profile.png'

const Menu = props => (
  <div className="flex flex-col items-end absolute self-end">
    <a onClick={props.handleToggleMenu} className=" text-grey">
      <i className="fa fa-ellipsis-h fa-normal"></i>
    </a>
    <div className={`card flex flex-col text-sm duration-2 ${props.open ? 'rotate-x-0' : 'rotate-x-90'}`}>
      <a className="py-2 px-4 text-grey-darker hover:text-grey-darkest border-b border-grey-lighter">
        <i className="fa fa-pencil"></i>
        Edit
      </a>
      <a className="py-2 px-3 text-red hover:text-red-dark" onClick={() => props.handleDeletePost(props.post)}>
        <i className="fa fa-trash"></i>
        Delete
      </a>
    </div>
  </div>
)

const UserInfo = props => (
  <React.Fragment>
    {props.user && <div>
      <div className="flex mb-2 -mb-6">
        <img src={ props.user.profile_image || profileImage } className="h-12 w-12 rounded-full" />
    	<div className="flex flex-row ml-4">
          <a className="font-bold text-black" href={`/users/${props.user.username}`}>{props.user.name}</a>
          <a className="text-grey ml-1" href={`/users/${props.user.username}`}>@{props.user.username}</a>
      	</div>
      </div> 
    </div>}
  </React.Fragment>
)

const PostControls = props => (
  <React.Fragment>
    <div className="flex flex-row justify-around mt-3 text-sm">
      <a><i className="fa fa-comment"></i>Comment</a>
      <a><i className="fa fa-share"></i>Repost</a>
      <a><i className="fa fa-heart"></i>Like</a>
    </div>
  </React.Fragment>
)

class Post extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      menuOpen: false
    }

    this.handleToggleMenu = this.handleToggleMenu.bind(this)
    this.handleDeletePost = this.handleDeletePost.bind(this)
  }

  handleToggleMenu() {
    console.log('toggle', this.state.menuOpen)
    this.setState({ menuOpen: !this.state.menuOpen })
  }

  handleDeletePost(post) {
    $swal.fire({
      title: 'Delete this post?',
      text: "You won't be able to revert this!",
      type: 'warning',
      showCancelButton: true,
      cancelButtonColor: '#d33',
      confirmButtonText: 'Delete post'
    }).then((result) => {
      if (result.value) {
        $axios.delete(`/posts/${post.id}`)
          .then(({data}) => {
            if (data.status === 200) {
              this.props.emitDeletion()
            } else {
              this.showErrors(data.errors)
            }
          })      
          .catch(err => this.showErrors([err]))
      }
    })
  }

  showErrors(errors) {
    $toast.fire({
      type: 'error',
      title: 'Error',
      text: errors.map(err => `${err}`).join(', ')
    })
  }

  render () {
    const props = this.props
    return (
      <React.Fragment>
        <div className="bg-white p-5 border-t border-solid border-primary-lightest flex flex-col">
          {props.itsMe && <Menu 
                            post={props.post}
                            open={this.state.menuOpen}
                            handleDeletePost={this.handleDeletePost}
                            handleToggleMenu={this.handleToggleMenu} /> }
          <UserInfo user={props.user} />
          <div className="ml-16 text-sm">
            {renderHTML($markdown.render(props.post.content))}
          </div>
          <PostControls />
        </div>
      </React.Fragment>
    );
  }
}

export default Post
