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


    const insertText = (s) => {
      switch (s){
        case'street':
          return 'on the'
        break;
        default:
          return 'at'
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

    

    const projects = this.state.projects.map((project,key)=>
      <div className='projectThumbs'>
      <img src={project.photo.url} key={key} ></img>
      <div className='projectText'>
      <h2><a href={`user/profile/${project.username}/${project._id}`}> {project.title} </a> </h2>
      <p><a href={`user/profile/${project.username}`}>{project.username}</a></p>
      <p>{`Made with ${project.materials}`}</p>
      <p>{checkLocation(project.location)}</p>
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
