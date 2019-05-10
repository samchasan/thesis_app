import axios from 'axios';
import React from 'react';
import Nav from 'react-bootstrap/Nav';



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
             <a href = {`/catalog/user/profile/${user}`} className='button is-small is-primary'> {user} </a>
             <a href = '/catalog/logout' className='button is-danger is-small is-inverted is-link'> Logout </a>
          </div>
        )
      }else{
        return(
          <div className='navbar-end'>
          <a href='/catalog/login' className='navbar-item is-small is-link is-inverted'> Login </a>
            <a href='/catalog/register' className='navbar-item is-small is-link is-inverted'> Register </a>
          </div>
        )
      }
    } 



    return(
      <nav id='main-nav' className='navbar is-success' role='navigation' aria-label='main navigation'>
        <div className='container'>
          <div className='navbar-brand'>
            <a className='navbar-item' href='/catalog'> 
              <img id='navLogo' alt-text='ChaffMap' src='/img/logoWhite.png' /> 
            </a>
            <div className='navbar-burger burger' data-target='navbarItems'>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
          <div id='navbarItems' className='navbar-menu'>
              <div className='navbar-start'>
                <a href='/catalog/projects' className='navbar-item '> Projects </a>
                <a href='/catalog/wastes'className='navbar-item'> Waste </a>
                <a href='/catalog/about' className='navbar-item'> About </a>
              </div>
                {checkLoggedIn()}
              </div>
          </div>
        </nav>
    )
  }
}

ReactDOM.render(<Navbar />, document.getElementById('navbar'));
