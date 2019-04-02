import axios from 'axios';
import React from 'react';

class Waste extends React.Component {
  constructor(props) {
    super(props);
    this.componentDidMount = this.componentDidMount.bind(this)
    this.state = {
      waste: [],
      wasteLoaded: false
    }
  }

  componentDidMount() {
    
    console.log('getting waste')
    axios.get('wasteJSON')
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

    const waste = this.state.waste.map((waste,key)=>
      <div className='wasteThumbs'>
      <img src={waste.photo.url} key={key} ></img>
      <div className='wasteText'>
      <h2><a href='wasteId'> {waste.title} </a> </h2>
      <p> Amount:{waste.amount}lbs </p>
      {/* <p> Frequency:{waste.frequency} </p> */}
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
