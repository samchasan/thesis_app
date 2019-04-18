import React from 'react';
import axios from 'axios';
import { assertIdentifier } from 'babel-types';


class Register extends React.Component {
  constructor(props) {
    super(props)
    this.register = this.register.bind(this)
    this.setUsername = this.setUsername.bind(this)
    this.setEmail = this.setEmail.bind(this)
    this.setPassword = this.setPassword.bind(this)
    this.state = {
      username: '',
      email:'',
      password: '',
    }
  }

 async register() {
  const username = this.state.username
    await axios.post('register', this.state, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(function (response) {
      console.log('axios register post response' , response)
      window.location = `user/profile/${username}`
      
    })
    .catch ( function (err) {
      console.log('error in axios register')
      alert(err)
      })
  // await axios.get('user/userJSON', function (res, err){

  // })
  axios.post('login', this.state, {
    headers: {
      'Content-Type': 'application/json',
      'username': username
    }
  })
  .then(function (response) {
    console.log('axios login post response' , response)
    // go to user id location
    window.location = '/'
    
  })
  .catch ( function (err) {
    console.log('error in axios login')
    alert(err)
    })
  }

  setUsername(event){
    this.setState({username: event.target.value});
    console.log(this.state.username)
  }
  setEmail(event){
    this.setState({email: event.target.value});
    console.log(this.state.email)
  }
  setPassword(event){
    this.setState({password: event.target.value});
    console.log(this.state.password)
  }


  render() {
return(
      <form>
        <div className='form-group'>
          <label htmlFor='username'> Username:</label>
            <input id='username' onChange={this.setUsername} className='form-control' type='text' placeholder='madDasher' name='username'> 
          </input>
        </div>
        <div className='form-group'>
          <label htmlFor='email'> E-mail:</label>
            <input id='email' onChange={this.setEmail} className='form-control' type='text' placeholder='doug@gail.com' name='email' >
          </input>
        </div>
        <div className='form-group'>
          <label htmlFor='password'> Password:</label>
            <input id='password' onChange={this.setPassword} className='form-control' type='text' placeholder='********' name='password' >
          </input>
        </div>
      <button className='btn.btn-primary' type='button' onClick={this.register} > Submit</button>
      </form>
    )
  }
}

ReactDOM.render(<Register />, document.getElementById('registerBox'));
