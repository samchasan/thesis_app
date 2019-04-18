import axios from 'axios';
import React from 'react';


class WasteJSON extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    console.log('posting wastes')
    axios.post('wastesJSON')
    console.log('wastes posted')
  }

  render(){
    return(
      <div>
      </div>
    )
  }
}

ReactDOM.render(<WasteJSON />, document.getElementById('wastesJSON'));
