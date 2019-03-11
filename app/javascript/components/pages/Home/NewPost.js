import React from "react"
import PropTypes from "prop-types"
import renderHTML from 'react-render-html'
import Modal from 'react-awesome-modal'

const MarkdownPreview = props => (
  <React.Fragment>
    {props.open && <div className="px-5 py-3 bg-white">
      <h3 className="border-b border-grey-light mb-2">Post preview</h3>
      {renderHTML($markdown.render($emoji.emojify(props.content)))}
    </div>}
  </React.Fragment>
)

class NewPost extends React.Component {

  constructor(props) {
    super(props)

    const post = props.post ? props.post : { content: '' }

    this.state = {
      post,
      preview: false
    }

    this.handlePostTextChange = this.handlePostTextChange.bind(this)
    this.handleSubmitPost     = this.handleSubmitPost.bind(this)
    this.handleUpdatePost     = this.handleUpdatePost.bind(this)
    this.handleCreatePos      = this.handleCreatePost.bind(this)

    this.handleTogglePreview  = this.handleTogglePreview.bind(this)
  }

  handleTogglePreview() {
    this.setState({ preview: !this.state.preview })
  }

  handlePostTextChange(content) {
    this.setState({
      post: {
        ...this.state.post,
        content
      }
    })
  }

  handleSubmitPost() {
    if (this.state.post.id) {
      this.handleUpdatePost(this.state.post)
    } else {
      this.handleCreatePost(this.state.post)    
    }
    if (this.props.onSubmit) this.props.onSubmit()
  }

  handleUpdatePost(post) {
    $axios.put(`/posts/${post.id}`, post)
      .then(({data}) => {
        if (data.status !== 200) this.showErrors(data.errors)
      })
      .catch(err => this.showErrors([err]))
  }

  handleCreatePost(post) {
    $axios.post('/posts', { post: this.state.post })
      .then(({data}) => {
        if (data.status === 200) {
          this.setState({
            post: {
              content: ''
            }
          })
        } else this.showErrors(data.errors)
      })
      .catch(err => this.showErrors([err]))
  }

  showErrors(errors) {
    $toast.fire({
      type: 'error',
      title: 'Error',
      text: errors.map(err => `${err}`).join(', ')
    })
  }
 

  componentDidMount() {
    [...document.getElementsByClassName('textarea-post')].map(textarea => {
      $autosize(textarea)
    })
  }

  render () {
    const buttonDisabled = this.state.post.content.lenght <= 0
    return (
      <React.Fragment>
        <div className="bg-white rounded-t p-3 flex flex-col">
          <textarea
            value={this.state.post.content}
            onChange={e => this.handlePostTextChange(e.target.value)}
            className="textarea-post textarea m-h-4 focus:bg-white"
            placeholder="Share an idea (With markdown if you want)"></textarea>
          <div className="flex flex-row justify-end items-center">
            <a onClick={this.handleTogglePreview} className="text-primary-light text-xs pr-3">Preview Markdown</a>
            <button
              className={`btn primary self-end ${buttonDisabled && 'cursor-not-allowed opacity-50'}`}
              disabled={buttonDisabled}
              onClick={this.handleSubmitPost}>Post</button>
          </div>
        </div>
        <MarkdownPreview
          close={this.handleTogglePreview}
          open={this.state.preview}
          content={this.state.post.content} />
      </React.Fragment>
    );
  }
}

export default NewPost
