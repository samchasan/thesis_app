import axios from 'axios';
import React from 'react';


class ProjectJSON extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    console.log('posting projects')
    axios.post('projectJSON')
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
