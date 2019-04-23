import React from 'react';
import axios from 'axios';


class Search extends React.Component {
  constructor(props) {
    super(props)
    this.search = this.search.bind(this)
    this.setInput = this.setInput.bind(this)
    this.state = {
      searchInput: '',
    }
  }

  search() {

    axios.post('/search', this.state, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(function (response) {
      console.log('login response', response)
      window.location = '/'
      
    }).catch ( function (err) {
        alert(err)
      })
    
  }
  setInput(event){
    this.setState({searchInput: event.target.value});
    console.log(this.state.searchInput)
  }
  


  render() {
return(
      <form >
        <div className='form-group'>
        <label htmlFor='searchInput'></label>
        <input id='searchInput' onChange={this.setInput} className='form-control' type='text' placeholder='Seattle' name='searchInput'> 
        </input>
        </div>
     
      <button class='button is-link' type='button' onClick={this.search} > search </button>
      </form>
    )
  }
}

ReactDOM.render(<Search />, document.getElementById('searchBox'));
