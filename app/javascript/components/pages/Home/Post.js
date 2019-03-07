import React from "react"
import PropTypes from "prop-types"
//import Modal from 'react-responsive-modal'
import Modal from 'react-awesome-modal';
import renderHTML from 'react-render-html'
import NewPost from './NewPost'

import profileImage from '../../../../assets/images/profile.png'

const Menu = props => (
  <div className="flex flex-col items-end absolute self-end">
    <a onClick={props.handleToggleMenu} className=" text-grey">
      <i className="fa fa-ellipsis-h fa-normal"></i>
    </a>
    <div className={`card flex flex-col text-sm duration-2 ${props.open ? 'rotate-x-0' : 'rotate-x-90'}`}>
      <a className="py-2 px-4 text-grey-darker hover:text-grey-darkest border-b border-grey-lighter" onClick={() => props.handleEditPost(props.post)}>
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

const PostControls = props => {
  const liked = props.post.like_ids.some(id => id === props.currentUser.id)
  const toggleLike = () => {
    if (liked)  props.handleUnlike()
    else        props.handleLike()
  }

  return <React.Fragment>
    <div className="flex flex-row justify-around mt-3 text-sm">
      <a className="text-grey-darker"><i className="fa fa-comment"></i>Comment</a>
      <a className="text-grey-darker"><i className="fa fa-share"></i>Repost</a>
      <a onClick={() => toggleLike()} className={`text-${liked ? 'red' : 'grey-darker'}`}>
        <i className="fa fa-heart"></i>
        {liked ? 'Liked' : 'Like'}
      </a>
    </div>
  </React.Fragment>
}

const EditPostModal = props => (
  <Modal
    visible={props.open}
    width="600"
    effect="fadeInUp"
    onClickAway={props.close}>
    <div className="m-5">
      <h3 className="border-b border-grey-light">Editing post</h3>
      {props.post && <NewPost post={props.post} onSubmit={props.close} />}
    </div>
  </Modal>
)

class Post extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      menuOpen: false,
      edit: {
        open: false,
        post: null
      }
    }

    this.handleToggleMenu = this.handleToggleMenu.bind(this)
    this.handleDeletePost = this.handleDeletePost.bind(this)
    this.handleEditPost   = this.handleEditPost.bind(this)

    this.handleLike       = this.handleLike.bind(this)
    this.handleUnlike     = this.handleUnlike.bind(this)
  }

  handleToggleMenu() {
    this.setState({ menuOpen: !this.state.menuOpen })
  }

  handleLike() {
    $axios.post('/posts/like', { id: this.props.post.id })
      .then(({data}) => {
        if (data.status !== 200) {
          this.showErrors(data.errors)
        } else console.log(data)
      }).catch(err => this.showErrors([err]))
  }

  handleUnlike() {
    $toast.fire('unlike')
  }

  handleEditPost(post) {
    this.handleToggleMenu()
    this.setState({
      edit: {
        open: true,
        post
      }
    })
  }

  handleDeletePost(post) {
    this.handleToggleMenu()
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
            if (data.status !== 200) {
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
                            handleEditPost={this.handleEditPost}
                            handleToggleMenu={this.handleToggleMenu} /> }
          <UserInfo user={props.user} />
          <div className="ml-16 text-sm">
            {renderHTML($markdown.render(props.post.content))}
          </div>
          <PostControls
            handleUnlike={this.handleUnlike}
            handleLike={this.handleLike}
            currentUser={props.currentUser}
            post={props.post} />
        </div>
        <EditPostModal
          close={() => this.setState({ edit: { open: false, post: null } })}
          open={this.state.edit.open}
          post={this.state.edit.post} />
      </React.Fragment>
    );
  }
}

export default Post
