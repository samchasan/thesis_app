import axios from 'axios';
import React from 'react';


class ProjectJSON extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      path: window.location.pathname
    }
  }

  componentDidMount() {
    const user = this.state.path.replace('/catalog/user/profile/', '')

    console.log('posting projects')
    axios.post(`${user}/projectJSON`)
    console.log('projects posted')
  }

  render(){
    return(
      <div>
      </div>
    )
  }
}

ReactDOM.render(<ProjectJSON />, document.getElementById('projectJSON'));
