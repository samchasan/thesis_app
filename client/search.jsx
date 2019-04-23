import React from 'react';
import axios from 'axios';


class Search extends React.Component {
  constructor(props) {
    super(props)
    this.search = this.search.bind(this)
    this.setlocation = this.setlocation.bind(this)
    this.state = {
      location: '',
    }
  }

  search() {
    const location = this.state.location

    axios.post('search', location, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(function (response) {
      console.log('search response', response)
      window.location = '/'
      
    }).catch ( function (err) {
        alert(err)
      })
    
  }
  setlocation(event){
    this.setState({location: event.target.value});
    console.log(this.state.location)
  }
  


  render() {
return(
      <form >
        <div className='form-group'>
        <label htmlFor='location'> location:</label>
        <input id='location' onChange={this.setlocation} className='form-control' type='text' placeholder='Seattle' name='location'> 
        </input>
        </div>
      <button class='button is-small is-link' type='button' onClick={this.search} > search </button>
      </form>
    )
  }
}

ReactDOM.render(<Search />, document.getElementById('searchBox'));
