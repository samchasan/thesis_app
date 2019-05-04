import axios from 'axios';
import React from 'react';


class Navbar extends React.Component {
  constructor(props) {
    super(props)
    this.componentDidMount = this.componentDidMount.bind(this)

    this.state = {
      path: window.location.pathname,
      username: window.currentUser,
      // username: '',
      isLoggedIn: false,
      // props: props
    }
  }

 async componentDidMount() {

    if(this.state.username){
    
      this.setState({
        isLoggedIn: true,
      })
    }
  }

  render(){

    const checkLoggedIn = () => {

      if(this.state.isLoggedIn){

      const user = this.state.username
      console.log('user', user)
      
        return(
          <div>
             <a href = {`/catalog/user/profile/${user}`} class='button is-small is-primary'> {user} </a>
             <a href = '/catalog/logout' class='button is-danger is-small is-inverted is-link'> Logout </a>
          </div>
        )
      }else{
        return(
          <div>
            <a href='/catalog/login' class='button is-small is-inverted is-link'> Login </a>
            <a href='/catalog/register' class='button is-small is-inverted is-link'> Register </a>
          </div>
        )
      }
    } 



    return(
      <div id='nav-bar'>
        <div class="nav-bar-start">
            <a id='navLogoLink' href='/catalog'> <img id='navLogo' alt-text='ChaffMap' src='/img/logoWhite.png' /> </a>
            <a href='/catalog/projects' class='button is-success is-inverted is-outlined'> Projects </a>
            <a href='/catalog/wastes'class='button is-success is-inverted is-outlined'> Waste </a>
            <a href='/catalog/about' class='button is-success  is-inverted is-outlined'> About </a>
        </div>
        <div class="nav-bar-end">
            {checkLoggedIn()}
         </div>

      </div>
    )
  }
}

ReactDOM.render(<Navbar />, document.getElementById('navbar'));
