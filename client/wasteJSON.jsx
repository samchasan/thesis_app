import axios from 'axios';
import React from 'react';


class ProjectJSON extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    console.log('posting waste')
    axios.post('wasteJSON')
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
