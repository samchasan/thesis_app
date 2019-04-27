import axios from 'axios';
import React from 'react';


class WasteJSON extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      path: window.location.pathname
    }
  }

  componentDidMount() {
    const path = this.state.path.replace('/catalog/user/profile/', '')



    console.log('posting single waste', path)
    axios.post(`../../${path}/singleWasteJSON`)
    // console.log('single waste posted')
  }

  render(){
    return(
      <div>
      </div>
    )
  }
}

ReactDOM.render(<WasteJSON />, document.getElementById('singleWasteJSON'));
