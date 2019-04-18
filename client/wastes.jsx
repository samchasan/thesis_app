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

    const frequency = this.state.wastes.frequ

    const wastes = this.state.wastes.map((waste,key)=>
      <div id={key} className='wasteThumbs'>
      <img src={waste.photo.url} key={key} ></img>
      <div className='wasteText'>
      <h2><a href={`user/profile/${waste.username}/waste/${waste._id}`}> {waste.title} </a> </h2>
      <p>Producer:{waste.username}</p>
      <p>Amount:{waste.amount} </p>
      <p>Frequency:{`${waste.frequency}`} </p>
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
