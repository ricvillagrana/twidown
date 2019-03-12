import React from "react"
import PropTypes from "prop-types"
//import Modal from 'react-responsive-modal'
import Modal from 'react-awesome-modal';
import renderHTML from 'react-render-html'
import NewPost from './NewPost'

import profileImage from '../../../../assets/images/profile.png'

const Menu = props => (
  <div className={`flex flex-col items-end absolute self-end ${props.open ? 'z-40' : 'z-0'}`}>
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
          <div>
            <a className="font-bold text-black" href={`/users/${props.user.username}`}>{props.user.name}</a>
            <a className="text-primary-light ml-1 text-sm" href={`/users/${props.user.username}`}>@{props.user.username}</a>
            <span className="ml-2 text-grey text-xs" title={$moment(props.post.created_at).calendar()}>{$moment(props.post.created_at).fromNow()}</span>
          </div>
      	</div>
      </div> 
    </div>}
  </React.Fragment>
)

const PostControls = props => {
  const liked = props.post.like_ids.some(id => id === props.currentUser.id)

  const toggleLike = () => {
    if (liked)  props.handleDislike()
    else        props.handleLike()
  }

  return <React.Fragment>
    <div className="flex flex-row justify-around mt-3 text-sm">
      <a className="text-grey-darker" onClick={() => props.handleCommentOn(props.post.id)}><i className="fa fa-comment"></i>Comment</a>
      <a className="text-grey-darker" onClick={() => props.handleRepost(props.post.id)}>
        {props.post.repost_count}
        <i className="fa fa-share ml-2"></i>
        Repost
      </a>
      <a onClick={() => toggleLike()} className={`tooltip text-${liked ? 'red' : 'grey-darker'}`}>
        {props.post.likes_count}
        <i className="fa fa-heart ml-2"></i>
        {liked ? 'Liked' : 'Like'}
        <span className="tooltiptext">{props.post.likes_count === 0 ? 'No likes' : props.post.users.map(u => u.username).join(', ')}</span>
      </a>
    </div>
  </React.Fragment>
}

const PostModal = props => (
  <Modal
    visible={props.open}
    width="600"
    effect="fadeInUp"
    onClickAway={props.close}>
    <div className="m-5">
      <h3 className="border-b border-grey-light">{props.title}</h3>
      {props.post && <NewPost post={props.post} onSubmit={props.close} />}
      {props.info && (
        <div>
          {renderHTML($markdown.render(props.info.post.content))}
        </div>
      )}
    </div>
  </Modal>
)

const Repost = props => (
  <div id={`post-${props.post.id}`} className="bg-grey-lightest p-3 border border-solid border-grey-light rounded flex flex-col duration-3">
    <UserInfo user={props.user} post={props.post} />
    <div className="text-sm">
      {renderHTML($markdown.render(props.post.content))}
    </div>
  </div>
)

const LinkToParent = props => (
  <a className="text-xs mb-2"
    onClick={() => {
      window.scrollTo(
        0, // X axis
        document.getElementById(`post-${props.parentId}`).offsetTop - 300 // Y axis
      )
      // Let's delay the animation

      const classes = ['rounded-lg', 'shadow-lg', 'animated', 'pulse']
      setTimeout(() => {
        document.getElementById(`post-${props.parentId}`).classList.add(...classes)
        setTimeout(() => {
          document.getElementById(`post-${props.parentId}`).classList.remove(...classes)
        }, 800)
      }, 500)

    }}>See parent post</a>
)

class Post extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      menuOpen: false,
      edit: {
        open: false,
        post: null,
        content: ''
      },
      comment: {
        open: false,
        post_id: 0,
        content: ''
      },
      repost: {
        open: false,
        repost_id: 0,
        content: ''
      }
    }

    this.handleToggleMenu = this.handleToggleMenu.bind(this)
    this.handleDeletePost = this.handleDeletePost.bind(this)
    this.handleEditPost   = this.handleEditPost.bind(this)

    this.handleLike       = this.handleLike.bind(this)
    this.handleDislike    = this.handleDislike.bind(this)
    this.handleCommentOn  = this.handleCommentOn.bind(this)
    this.handleRepost     = this.handleRepost.bind(this)
  }

  handleRepost(id) {
    this.setState({
      repost: {
        ...this.state.comment,
        open: true,
        post: {
          content: '',
          repost_id: id
        }
      }
    })
  }

  handleCommentOn(id) {
    this.setState({
      comment: {
        ...this.state.comment,
        open: true,
        post: {
          content: '',
          post_id: id
        }
      }
    })
  }

  handleToggleMenu() {
    this.setState({ menuOpen: !this.state.menuOpen })
  }

  handleLike() {
    $axios.post('/posts/like', { id: this.props.post.id })
      .then(({data}) => {
        if (data.status !== 200) {
          this.showErrors(data.errors)
        }
      }).catch(err => this.showErrors([err]))
  }

  handleDislike() {
    $axios.delete(`/posts/dislike/${this.props.post.id}`)
      .then(({data}) => {
        if (data.status !== 200) {
          this.showErrors(data.errors)
        }
      }).catch(err => this.showErrors([err]))
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

  componentWillUnmount(){
    this.mounted = false;
  }

  render () {
    const props = this.props
    return (
      <React.Fragment>
        <div id={`post-${props.post.id}`} className="bg-white p-5 border-t border-solid border-primary-lightest flex flex-col duration-3">
          {props.post.post_id && <LinkToParent parentId={props.post.post_id} />}
          {props.itsMe && <Menu 
                            post={props.post}
                            open={this.state.menuOpen}
                            handleDeletePost={this.handleDeletePost}
                            handleEditPost={this.handleEditPost}
                            handleToggleMenu={this.handleToggleMenu} /> }
          <UserInfo user={props.user} post={props.post} />
          <div className="ml-16 text-sm">
            {renderHTML($markdown.render(props.post.content))}
            {props.post.repost_id && <Repost post={props.post.original_post} />}
          </div>
          <PostControls
            handleDislike={this.handleDislike}
            handleLike={this.handleLike}
            handleCommentOn={this.handleCommentOn}
            handleRepost={this.handleRepost}
            currentUser={props.currentUser}
            post={props.post} />
        </div>
        <PostModal
          title="Editing post"
          close={() => this.setState({ edit: { open: false, post: null } })}
          open={this.state.edit.open}
          post={this.state.edit.post} />
        <PostModal
          title={`Commenting on ${props.post.user.name}'s post`}
          close={() => this.setState({ comment: { open: false, post: null } })}
          open={this.state.comment.open}
          post={this.state.comment.post} />
        <PostModal
          title={`Reposting ${props.post.user.name}'s post`}
          info={{ post: props.post }}
          close={() => this.setState({ repost: { open: false, post: null } })}
          open={this.state.repost.open}
          post={this.state.repost.post} />
      </React.Fragment>
    );
  }
}

export default Post
