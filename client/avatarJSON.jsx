import axios from 'axios';
import React from 'react';


class AvatarJSON extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    console.log('posting avatar')
    axios.post('avatarJSON')
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
