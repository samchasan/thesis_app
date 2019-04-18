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
      <form >
        <div className='form-group'>
        <label htmlFor='username'> Username:</label>
        <input id='username' onChange={this.setUsername} className='form-control' type='text' placeholder='madDasher' name='username'> 
        </input>
        </div>
      <div className='form-group'>
        <label htmlFor='password'> Password:</label>
        <input id='password' onChange={this.setPassword} className='form-control' type='text' placeholder='********' name='password' >
        </input>
        </div>
      <button className='btn.btn-primary' type='button' onClick={this.login} > Submit</button>
      </form>
    )
  }
}

ReactDOM.render(<Login />, document.getElementById('loginBox'));
