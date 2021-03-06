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

    axios.post('', this.state, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(function (response) {
      window.location = '/'
      console.log('search response', response)
      
    }).catch ( function (err) {
        alert(err)
      })
    
  }
  setInput(event){
    this.setState({searchInput: event.target.value});
    console.log(this.state.searchInput )
  }
  


  render() {
return(
      <form method='POST' preventDefault='true' onSubmit={this.search}>
        <div className='form-group'>
        <label htmlFor='searchInput'></label>
        <input id='searchInput' onChange={this.setInput} className='form-control' type='text' placeholder='Seattle' name='searchInput'> 
        </input>     
      <button class='button is-primary is-large' type='button' onClick={this.search} > search </button>
      </div>

       </form> 
    )
  }
}

ReactDOM.render(<Search />, document.getElementById('searchBox'));
