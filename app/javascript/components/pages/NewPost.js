import React from "react"
import PropTypes from "prop-types"

class NewPost extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      postText: ''
    }

    this.handlePostTextChange = this.handlePostTextChange.bind(this)
  }

  handlePostTextChange(text) {
    this.setState({
      postText: text
    })
  }

  componentDidMount() {
    $autosize(document.getElementById('textarea-post'))
  }

  render () {
    const buttonDisabled = this.state.postText.length <= 0
    return (
      <React.Fragment>
        <div className="bg-white rounded-t p-3 flex flex-col">
          <textarea
            id="textarea-post"
            onChange={e => this.handlePostTextChange(e.target.value)}
            className="textarea m-h-4 focus:bg-white"
            placeholder="Share an idea (With markdown if you want)"></textarea>
          <div className="flex flex-row justify-end items-center">
            <a className="text-primary-light text-xs pr-3">Preview Markdown</a>
            <button className={`btn primary self-end ${buttonDisabled && 'cursor-not-allowed opacity-50'}`} disabled={buttonDisabled}>Post</button>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default NewPost
