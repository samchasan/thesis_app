import axios from 'axios';
import React from 'react';

class Waste extends React.Component {
  constructor(props) {
    super(props);
    this.componentDidMount = this.componentDidMount.bind(this)
    this.state = {
      waste: [],
      isOwner: false,
      wasteLoaded: false,
      path: window.location.pathname
      

    }
  }

  componentDidMount() {
    
    // console.log('getting waste')
    const user = this.state.path.replace('/catalog/user/profile/', '')

    axios.get(`${user}/userJSON`)
    .then((res) => {      
      if(res.data.waste.length > 1){
      res.data.waste.forEach((waste) => { 
      this.state.waste.push(waste)
      if(res.data.currentUser){
        const user = res.data.currentUser
        if (user._id === waste.userID){
          this.setState({isOwner:true})
        }
      }
    })
    }else{
      this.setState({
        waste: [res.data.waste[0]]
      })
      if(res.data.currentUser){
        const user = res.data.currentUser
        if (user._id === waste.userID){
          this.setState({isOwner:true})
        }
      }
    }
    
    
    
      // console.log(this.state.waste)
      this.setState({
        wasteLoaded: true
      })
    })
    .catch((err) => {
      console.log(err);
    })    
  }

  


  
  render() {

    // console.log('in render' , this.state.isOwner)

    const editButton = (waste) => {
      if(this.state.isOwner === true){
        console.log('making edit button')
      return (
        <a href={`${waste.username}/waste/${waste._id}`} 
           className='button is-small is-link'>
        <span className="icon is-small">
        <i className="far fa-edit">
            </i>
          </span>
      </a>
      )
      }
    }

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


    function isEmpty(obj) {
      for (var key in obj) {
        if (obj.hasOwnProperty(key))
          return false;
      }
      return true;
    }

    const checkLocation = (location) => {
      if(isEmpty(location)){
        return  null
      } else {
        return (
          <p> {`Found ${insertText(location.address)} ${location.address}`} </p>
        )
    }
  }


    const frequencyIndicator = (frequency) => {
      if(isEmpty(frequency)){
        return null
      }else{
        // console.log('frequency indicator', waste)
        return(
          <p>{`${capitalize(frequency.category)} ${insertText(frequency.category)} ${frequency.moment}`}</p>
        )
      } 
    }

    const waste = this.state.waste.map((waste,key)=>
      <div className='wasteThumbs'>
        <img src={waste.photo.url} key={key} ></img>
        <div className='wasteText'>
          <h2><a href={`${waste.username}/waste/${waste._id}`}> {waste.title} </a> </h2>
          <div>{editButton(waste)}</div>
          <p>{`${waste.amount} lbs`}</p>
            {frequencyIndicator(waste.frequency)}    
            {checkLocation(waste.location)}  
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
