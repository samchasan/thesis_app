import axios from 'axios';
import React from 'react';



class Waste extends React.Component {
  constructor(props) {
    super(props);
    this.componentDidMount = this.componentDidMount.bind(this)
    this.state = {
      wastes: [],
      wastesLoaded: false,
    }
  }

  componentDidMount() {
    console.log('getting wastes')
    axios.get('wastesJSON')
    .then((res) => {      
      res.data.wastes.forEach((waste) => { 
      this.state.wastes.push(waste)
      // console.log(res.data)
    })
      console.log(this.state.wastes)
      this.setState({
        wastesLoaded: true
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

    const wastes = this.state.wastes.map((waste,key)=>
      <div id={key} className='wasteThumbs'>
      <img src={waste.photo.url} key={key} ></img>
      <div className='wasteText'>
      <h2><a href={`user/profile/${waste.username}/waste/${waste._id}`}> {waste.title} </a> </h2>
      <p><a href={`user/profile/${waste.username}`}>{waste.username}</a></p>
      <p>{`${waste.amount} lbs`} </p>
      <p>{`${capitalize(waste.frequency.category)} ${insertText(waste.frequency.category)} ${waste.frequency.moment}`}</p>
      </div>
      </div>
    );

    return (
      <div>
          <div className='wasteGallery'>
          {wastes}
          </div> 
      </div>
    )
  
  
  }
}


const domContainer = document.querySelector('#wastes');

ReactDOM.render(< Waste />, domContainer);
