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

    console.log('posting waste')
    axios.post(`${user}/wasteJSON`)
    console.log('waste posted')
  }

  render(){
    return(
      <div>
      </div>
    )
  }
}

ReactDOM.render(<ProjectJSON />, document.getElementById('wasteJSON'));
