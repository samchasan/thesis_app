import axios from 'axios';
import React from 'react';



class Projects extends React.Component {
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

    const wastes = this.state.wastes.map((waste,key)=>
      <div className='wasteThumbs'>
      <img src={waste.photo.url} key={key} ></img>
      <div className='wasteText'>
      <h2><a href='wasteId'> {waste.title} </a> </h2>
      <p>By:{waste.username}</p>
      <p> Materials:{waste.materials} </p>
      <p> Found:{waste.location} </p>
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

ReactDOM.render(< Projects />, domContainer);
