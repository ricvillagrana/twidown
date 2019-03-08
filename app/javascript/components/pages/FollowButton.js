import React from 'react'


class FollowButton extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      isLoading: false,
      me: null
    }

    this.fetchMe        = this.fetchMe.bind(this)
    this.handleFollow   = this.handleFollow.bind(this)
    this.handleUnfollow = this.handleUnfollow.bind(this)
  }

  componentDidMount() {
    this.fetchMe()
  }

  fetchMe() {
    $axios.get('/users/me')
      .then(({data}) => {
        const user = data.user

        this.setState({ me: user })
      })
      .catch(err => {
        $toast({
          type: 'error',
          title: 'Error',
          text: 'Error on fetch user info.'
        })
      })
  }

  handleFollow() {
    this.setState({ isLoading: true })
    $axios.post('/users/follow', { id: this.props.user.id })
      .then(({data}) => {
        this.setState({ isLoading: false })
        if (data.status === 200) {
          this.setState({
            me: {
              ...this.state.me,
              following_ids: [
                data.followed.id,
                ...this.state.me.following_ids
              ]
            }
          })
        } else {
          this.showErrors(data.errors)
        }
      })
      .catch(err => this.showErrors([err]))
  }

  handleUnfollow() {
    this.setState({ isLoading: true })
    $axios.delete(`/users/unfollow/${this.props.user.id}`)
      .then(({data}) => {
        if (data.status === 200) {
          this.setState({ isLoading: false })
          let following_ids = this.state.me.following_ids.filter(id => id !== data.unfollowed.id)
          this.setState({
            me: {
              ...this.state.me,
              following_ids
            }
          })
        } else {
          this.showErrors(data.errors)
        }
      })
      .catch(err => this.showErrors([err]))
  }

  showErrors(errors) {
    console.log(errors)
    const errorsHTML = errors.map(err => `<li>${err}</li>`).join('')
    $swal.fire({
      type: 'error',
      title: 'Error',
      html: `<ul>${errorsHTML}</ul>`
    })
  }

  render() {
    const { props } = this
    return (
      <div className="flex flex-row items-center">
        {this.state.me && (this.state.me.following_ids.some(id => id === props.user.id) ? 
        <button 
          disabled={this.state.isLoading}
          onClick={this.handleUnfollow}
          className="btn red">
          {this.state.isLoading && <i className="fa fa-spinner fa-spin"></i>}
          Unfollow
        </button>
        : 
        <button 
          disabled={this.state.isLoading}
          onClick={this.handleFollow}
          className="btn primary">
          {this.state.isLoading && <i className="fa fa-spinner fa-spin"></i>}
          Follow
        </button>)}
 
      </div>
    )
  }
}

export default FollowButton

