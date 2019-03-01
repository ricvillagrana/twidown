import React from "react"
import PropTypes from "prop-types"

class NewPost extends React.Component {

  constructor(props) {
    super(props)


    this.state = {
      post: {
        content: ''
      }
    }

    this.handlePostTextChange = this.handlePostTextChange.bind(this)
    this.handleSubmitPost     = this.handleSubmitPost.bind(this)
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
        this.setState({
          post: {
            content: ''
          }
        }, () => this.props.handleUpdateFeed())
      })
      .catch(err => {
        $toast.fire({
          type: 'error',
          title: 'Error creating the post',
          text: `${err}`
        })
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
            <a className="text-primary-light text-xs pr-3">Preview Markdown</a>
            <button
              className={`btn primary self-end ${buttonDisabled && 'cursor-not-allowed opacity-50'}`}
              disabled={buttonDisabled}
              onClick={this.handleSubmitPost}>Post</button>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default NewPost
