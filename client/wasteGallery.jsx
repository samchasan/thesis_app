import axios from 'axios';
import React from 'react';

class Waste extends React.Component {
  constructor(props) {
    super(props);
    this.componentDidMount = this.componentDidMount.bind(this)
    this.state = {
      waste: [],
      wasteLoaded: false,
      path: window.location.pathname

    }
  }

  componentDidMount() {
    
    console.log('getting waste')
    const user = this.state.path.replace('/catalog/user/profile/', '')

    axios.get(`${user}/wasteJSON`)
    .then((res) => {      
      // console.log(res.data)
      res.data.waste.forEach((waste) => { 
      this.state.waste.push(waste)
      // console.log(project)
    })
      console.log(this.state.waste)
      this.setState({
        wasteLoaded: true
      })
    })
    .catch((err) => {
      console.log(err);
    })    
  }

  
  render() {

    const capitalize = (s) => {
      if (typeof s !== 'string') return ''
      return s.charAt(0).toUpperCase() + s.slice(1)
    }

    const insertText = (s) => {
      switch (s){
        case'daily':
          return 'at'
        break;
        case'weekly' || 'monthly':
          return 'on'
        break;
        case'yearly':
          return 'in'
        break;
      } 
    }

    const waste = this.state.waste.map((waste,key)=>
      <div className='wasteThumbs'>
      <img src={waste.photo.url} key={key} ></img>
      <div className='wasteText'>
      <h2><a href={`${waste.username}/waste/${waste._id}`}> {waste.title} </a> </h2>
      <p>{`${waste.amount} lbs`}</p>
      <p>{`${capitalize(waste.frequency.category)} ${insertText(waste.frequency.category)} ${waste.frequency.moment}`}</p>
      </div>
      </div>
    );

    return (
      <div>
          <div className='wasteGallery'>
          {waste}
          </div>   
      </div>
    )
  }
}


const domContainer = document.querySelector('#waste');

ReactDOM.render(< Waste />, domContainer);
