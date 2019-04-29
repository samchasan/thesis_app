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
    this.setBusinessYesNo = this.setBusinessYesNo.bind(this)
    this.state = {
      username: '',
      email:'',
      isBusiness: false,
      password: ''
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
      // window.location = `user/profile/${username}`
      
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
    window.location = `user/profile/${username}`
    
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
  async setBusinessYesNo(event){
    if(event.target.value === 'yes'){
    await this.setState({isBusiness: true});
    console.log(this.state.isBusiness)
    }
  }
  


  render() {
return(
  <div>
<h3 class="title is-3">Sign Up</h3>
      <form>
        <div className='form-group'>
            <input id='username' onChange={this.setUsername} className='form-control' type='text' placeholder='username' name='username'> 
          </input>
        </div>
        <div className='form-group'>
            <input id='email' onChange={this.setEmail} className='form-control' type='text' placeholder='e-mail' name='email' >
          </input>
        </div>
        <div className='form-group'>
            <input id='password' onChange={this.setPassword} className='form-control' type='text' placeholder='password' name='password' >
          </input>
        </div>
        <div id='businessYesNo'>
          <label htmlFor='businessYesNo'>
            Are you a business?
          </label>
            <br></br>
          <div id='radioInputs' >
            <input type='radio' value='yes' onChange={this.setBusinessYesNo} name='businessYesNo' /> Yes <br></br>
            <input type='radio' value='no' onChange={this.setBusinessYesNo} name='businessYesNo' /> No <br></br>
          </div>
        </div>

      <button className='button is-primary' type='button' onClick={this.register} > Register </button>
      </form>
      </div>
    )
  }
}

ReactDOM.render(<Register />, document.getElementById('registerBox'));
