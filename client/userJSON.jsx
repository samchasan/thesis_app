import axios from 'axios';
import React from 'react';


class userJSON extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    console.log('posting user')
    axios.post('userJSON')
    console.log('user posted')
  }

  render(){
    return(
      <div>
      </div>
    )
  }
}

ReactDOM.render(<userJSON />, document.getElementById('userJSON'));
