import React from 'react';
import axios from 'axios';


class Login extends React.Component {
  constructor(props) {
    super(props)
    this.login = this.login.bind(this)
    this.setUsername = this.setUsername.bind(this)
    this.setPassword = this.setPassword.bind(this)
    this.state = {
      username: '',
      password: '',
    }
  }

  login() {
    const username = this.state.username

    axios.post('login', this.state, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(function (response) {
      console.log('login response', response)
      window.location = `user/profile/${username}`
      
    }).catch ( function (err) {
        alert(err)
      })
    
  }
  setUsername(event){
    this.setState({username: event.target.value});
    console.log(this.state.username)
  }
  setPassword(event){
    this.setState({password: event.target.value});
    console.log(this.state.password)
  }


  render() {
return(
    <div className='columns'>
    <div className='column is-quarter'></div>
    <div id='simpleForm' className='column is-half'>
      <h3 class='title is-h3'> Welcome Back</h3>
      <form >
        <div className='form-group'>
        <input id='username' onChange={this.setUsername} className='form-control' type='text' placeholder='username' name='username'> 
        </input>
        </div>
      <div className='form-group'>
        <input id='password' onChange={this.setPassword} className='form-control' type='password' placeholder='password' name='password' >
        </input>
        </div>
      <button className='button is-medium is-primary' type='button' onClick={this.login} > Login </button>
      </form>
      </div>
      <div className='column is-quarter'></div>
    </div> 
    )
  }
}

ReactDOM.render(<Login />, document.getElementById('loginBox'));
