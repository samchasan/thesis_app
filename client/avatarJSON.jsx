import axios from 'axios';

class AvatarJSON extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    axios.post('avatarJSON')
    console.log('posted')
  }

  render(){
    return(
      <div>
      </div>
    )
  }
}

ReactDOM.render(<AvatarJSON />, document.getElementById('avatarJSON'));
