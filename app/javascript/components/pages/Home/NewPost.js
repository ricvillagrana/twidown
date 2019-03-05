import React from "react"
import PropTypes from "prop-types"
import renderHTML from 'react-render-html'
import Modal from 'react-responsive-modal'

const MarkdownPreview = props => (
  <Modal open={props.open} onClose={props.onClose} center>
    <h3 className="border-b border-grey-light">Post preview</h3>
    <p>Here you can preview changes and how your post will look like.</p>
    {renderHTML($markdown.render(props.content))}
  </Modal>
)

class NewPost extends React.Component {

  constructor(props) {
    super(props)


    this.state = {
      post: {
        content: ''
      },
      preview: false
    }

    this.handlePostTextChange = this.handlePostTextChange.bind(this)
    this.handleSubmitPost     = this.handleSubmitPost.bind(this)

    this.handleTogglePreview  = this.handleTogglePreview.bind(this)
  }

  handleTogglePreview() {
    this.setState({ preview: !this.state.preview })
  }

  handlePostTextChange(content) {
    this.setState({
      post: {
        content
      }
    })
  }

  handleSubmitPost() {
    $axios.post('/posts', { post: this.state.post })
      .then(({data}) => {
        if (data.status === 200) {
          this.setState({
            post: {
              content: ''
            }
          })
        } else {
          this.showErrors(data.errors) 
        }
     })
      .catch(err => {
        this.showErrors([err]) 
      })
  }

  showErrors(errors) {
    $toast.fire({
      type: 'error',
      title: 'Error',
      text: errors.map(err => `${err}`).join(', ')
    })
  }
 

  componentDidMount() {
    $autosize(document.getElementById('textarea-post'))
  }

  render () {
    const buttonDisabled = this.state.post.content.lenght <= 0
    return (
      <React.Fragment>
        <div className="bg-white rounded-t p-3 flex flex-col">
          <textarea
            id="textarea-post"
            value={this.state.post.content}
            onChange={e => this.handlePostTextChange(e.target.value)}
            className="textarea m-h-4 focus:bg-white"
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
          onClose={this.handleTogglePreview}
          open={this.state.preview}
          content={this.state.post.content} />
      </React.Fragment>
    );
  }
}

export default NewPost
