import axios from 'axios';
import React from 'react';


class AvatarJSON extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      path: window.location.pathname
    }
  }

  componentDidMount() {
    const user = this.state.path.replace('/catalog/user/profile/', '')

    console.log('posting avatar')
    axios.post(`${user}/avatarJSON`)
    console.log('avatar posted')
  }

  render(){
    return(
      <div>
      </div>
    )
  }
}

ReactDOM.render(<AvatarJSON />, document.getElementById('avatarJSON'));
