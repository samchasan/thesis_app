import axios from 'axios';
import React from 'react';



class Projects extends React.Component {
  constructor(props) {
    super(props);
    this.componentDidMount = this.componentDidMount.bind(this)
    this.state = {
      projects: [],
      projectsLoaded: false,
    }
  }

  componentDidMount() {
    console.log('getting projects')
    axios.get('projectsJSON')
    .then((res) => {      
      res.data.projects.forEach((project) => { 
      this.state.projects.push(project)
      // console.log(res.data)
    })
      console.log(this.state.projects)
      this.setState({
        projectsLoaded: true
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
      <p>By:{project.username}</p>
      <p> Materials:{project.materials} </p>
      <p> Found:{project.location} </p>
      </div>
      </div>
    );

    return (
      <div>
          <div className='projectGallery'>
          {projects}
          </div> 
      </div>
    )
  
  
  }
}


const domContainer = document.querySelector('#projects');

ReactDOM.render(< Projects />, domContainer);
