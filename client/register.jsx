import React from 'react';
import axios from 'axios';


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

  register() {
    axios.post('user/userJSON', this.state, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(function (response) {
      console.log(response)
      window.location = '/'
      
    })
    .catch ( function (err) {
        alert(err)
      })
    // ))
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
      <form onSubmit={this.register} method='POST' preventdefault='true' >
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
      <button className='btn.btn-primary' type='submit'> Submit</button>
      </form>
    )
  }
}

ReactDOM.render(<Register />, document.getElementById('registerBox'));
