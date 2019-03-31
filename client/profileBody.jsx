import axios from 'axios';
import React from 'react';
import Gallery from "react-photo-gallery";



class ProfileBody extends React.Component {
  constructor(props) {
    super(props);
    this.componentDidMount = this.componentDidMount.bind(this)
    this.state = {
      projects: [],
      waste: [],
      projectsLoaded: false,
      wasteLoaded: false

    }
  }

  componentDidMount() {
    console.log('getting projects')
    axios.get('projectJSON')
    .then((res) => {      
      res.data.projects.forEach((project) => { 
      this.state.projects.push(project)
      // console.log(project)
    })
      console.log(this.state.projects)
      this.setState({
        projectsLoaded: true
      })
    })
    .catch((err) => {
      console.log(err);
    })
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

    const projects = this.state.projects.map((project,key)=>
      <div className='projectThumbs'>
      <img src={project.photo.url} key={key} ></img>
      <div className='projectText'>
      <h2><a href='projectId'> {project.title} </a> </h2>
      <p> Materials:{project.materials} </p>
      <p> Found:{project.location} </p>
      </div>
      </div>
    );

    const waste = this.state.waste.map((waste,key)=>
      <div className='wasteThumbs'>
      <img src={waste.photo.url} key={key} ></img>
      <div className='wasteText'>
      <h2><a href='wasteId'> {waste.title} </a> </h2>
      <p> Materials:{waste.materials} </p>
      <p> Found:{waste.location} </p>
      </div>
      </div>
    );



    return (
      <div>
          <div className='projectGallery'>
          {projects}
          </div> 
          
          <div className='wasteGallery'>
          {waste}
          </div>   
      </div>
    )
  
  
  }
}


const domContainer = document.querySelector('#profileBody');

ReactDOM.render(< ProfileBody />, domContainer);
