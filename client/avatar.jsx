import React from 'react';
import axios from 'axios';


class Avatar extends React.Component {
  constructor(props) {
    super(props)
    this.componentDidMount = this.componentDidMount.bind(this)
    this.state = {
      loading: false,
      file: null,
      url: 'img/blank-user-avatar',
      path: window.location.pathname
    };
  }

  componentDidMount() {
    let currentComponent = this;
    const user = this.state.path.replace('/catalog/user/profile/', '')

    console.log('getting avatar')
    axios.get(`${user}/avatarJSON`)
    .then((res) => {
      const data = JSON.parse(res.data)
            console.log(data)
      currentComponent.setState({
        url: data.url
      })
    })
    .catch((error) => {
      console.log(error);
    })
  }

  render() {

    let url = this.state.url
    console.log(url)
      return ( 
            <img src={url}/>
        );
    }
  }


ReactDOM.render(<Avatar/>, document.getElementById('avatar'));
