import axios from 'axios';
import React from 'react';



class Projects extends React.Component {
  constructor(props) {
    super(props);
    this.componentDidMount = this.componentDidMount.bind(this)
    this.state = {
      projects: [],
      projectsLoaded: false,
      path: window.location.pathname
    }
  }

  componentDidMount() {
    console.log('getting projects')
    const user = this.state.path.replace('/catalog/user/profile/', '')
    axios.get(`${user}/projectJSON`)
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

    const projects = this.state.projects.map((project,key)=>
    <div className='projectThumbs'>
      <img src={project.photo.url} key={key} ></img>
      <div className='projectText'>
      <h2><a href={`${project.username}/${project._id}`}> {project.title} </a> </h2>
      <p>{`Made with ${project.materials}`}</p>
      <p>{`Found ${insertText(project.location)} ${project.location}`}</p>
      
      
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
