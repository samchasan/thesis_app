import axios from 'axios';
import React from 'react';


class UserJSON extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      path: window.location.pathname
    }
  }

  componentDidMount() {
    // console.log(this.state.path)
    const user = this.state.path.replace('/catalog/user/profile/', '')
    console.log(user)
    console.log('posting user')
    axios.post(`${user}/userJSON`)
    console.log('user posted')
  }

  render(){
    return(
      <div>
      </div>
    )
  }
}

ReactDOM.render(<UserJSON />, document.getElementById('userJSON'));
