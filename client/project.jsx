import React from 'react';
import ReactS3 from 'react-s3';
import axios from 'axios';
import { assertTSPropertySignature } from 'babel-types';
import FormData from 'form-data'
// import {aws} from './keys'
const akid = process.env.AWSAccessKeyId
const asak = process.env.AWSSecretKey
const s3Bucket = 'chaffmap'
let photoData;

const config = {
  bucketName: s3Bucket,
  region: 'us-east-2',
  accessKeyId: akid,
  secretAccessKey: asak
}


class Project extends React.Component {
  constructor(props) {
    super(props)
    this.postProject = this.postProject.bind(this)
    this.editProject = this.editProject.bind(this)
    this.uploadPhoto = this.uploadPhoto.bind(this)
    this.setName = this.setName.bind(this)
    this.setMaterials = this.setMaterials.bind(this)
    this.setLocation = this.setLocation.bind(this)
    this.componentDidMount = this.componentDidMount.bind(this)

    this.state = {
      loading: false,
      // file: null,
      // url: 'http://www.clker.com/cliparts/3/m/v/Y/E/V/small-red-apple-hi.png',
      name: '',
      materials: '',
      location: '',
      path: window.location.pathname,
      file:'',
      project: {
        location: '',
        materials: [],
        photoURL: '',
        title: '',
        key: '',
        userID: '',
        username: '',
        id: ''
      },
      isOwner: false,
      editing: false

    };
  }

  componentDidMount() {
    let currentComponent = this;

    console.log('project js mounted')
    const url = `${this.state.path}/singleProjectJSON`
    axios.get(url)
    .then(function (response) {
      console.log('axios got url', response);
      const project = response.data.project
      console.log('got project', project)
      currentComponent.setState({project: {
        location: project.location,
        materials: project.materials,
        photoURL: project.photo.url,
        title: project.title,
        key: project.photo.key,
        userID: project.userID,
        username: project.username,
        id: project._id,
      }})
      console.log(currentComponent.state.project)

      if(response.data.currentUser){
        const user = response.data.currentUser
        console.log('user found', user)
        if (user._id === project.userID){
          currentComponent.setState({isOwner:true})
          console.log(currentComponent.state.isOwner)

        }
      }

    })
    .catch(function (error) {
      console.log(error);
    })
  }

  async postProject() {
    let currentComponent = this;

    event.preventDefault();

    await this.setState({
      loading:true
    });

    // const key = currentComponent.state.project.key;
    // console.log(config)
    // debugger
    // ReactS3.deleteFile(key, config)
    // .then((response) => console.log(response))
    // .catch((err) => console.error(err))

    const file = currentComponent.state.file;
    ReactS3.uploadFile(file, config)
    .then( (data) => {
      // debugger
        console.log(data);
        const photoMeta = { 
            'bucket': data.bucket,
            'key': data.key,
            'location': data.location
          }
        const formInput = {
          'photo': photoMeta,
          'text': currentComponent.state
        }
    var jsonse = JSON.stringify(formInput);
    var blob = new Blob([jsonse], {type: "application/json"});
    // const project = this.state.path.replace(`/catalog/user/profile/${this.state.userID}`, '')

      

      axios.post(`${currentComponent.state.project.id}`, blob, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
    })
    .then( () => {
      window.location = currentComponent.state.project.id
      console.log('window.location', window.location)
    })
    .catch ( (err) => {
      console.log(err)
    })
  }

  async uploadPhoto(event) {
    await this.setState({
      loading:true,
      file: event.target.files[0]
    });

    this.setState({
      loading: false,
      uploaded: true
    });
  }

  editProject(event){
    this.setState({editing: true})
  }

  setName(event){
    this.setState({name: event.target.value});
    console.log(this.state.name)
  }
  setMaterials(event){
    this.setState({materials: event.target.value});
    console.log(this.state.materials)
  }
  setLocation(event){
    this.setState({location: event.target.value});
    console.log(this.state.location)
  }

  render() {
    let indicatorText;
    let currentComponent = this

    if (this.state.loading) {
      indicatorText = 'Uploading file...'
    } else if (this.state.uploaded) {
      indicatorText = 'Uploaded'
    } else {
      indicatorText = 'Add a Project'
    }

    const viewCheck = () => {
      // debugger
      if(currentComponent.state.editing){
        return (
          <div>{editView()}</div>
        )
      }else {
        return(
          <div>{staticView()}</div>
        )
      }
    }

    const editButton = () => {
      if(this.state.isOwner){ 
        return (
          <button onClick={this.editProject}> Edit project</button>
        )
      } else {
        return (
          <p> <a href='../../../login'> login to edit </a> </p> 
        )
      }
  }
    const staticView = () => { 
      return (
      <div className='columns' >
        <div className='column is-one-quarter' id='projectInfo'>
          <h2> {project.title}</h2>
          <p>{`Made with ${project.materials}`}</p>
          <p>{`Found ${insertText(project.location)} ${project.location}`}</p>
          <p> By&nbsp; <a href={project.username}> {project.username} </a> </p>
          <div id='editControls'> {editButton()}</div>
        </div>
        <div className='column is-three-quarters' id='projectImage'>
          <img src={project.photoURL}></img>
        </div>
      </div>
    )}

    const editView = () => { 
      return ( 
        <span>
          <div className='columns' >
            <div className='column is-one-quarter' id='projectInfo'>
              <form onSubmit={this.postProject} method='POST' encType='multipart/form-data'>
                <label htmlFor='title'>
                  <input type='text' placeholder={this.state.project.title} defaultValue={this.state.project.title} onChange={this.setName} name='name' />
                </label>
                <label htmlFor='materials'>
                  <input type='text' placeholder={this.state.project.materials} defaultValue={this.state.project.materials} onChange={this.setMaterials} name='materials' />
                </label>
                <label htmlFor='location'>
                  <input type='text' placeholder={this.state.project.location} defaultValue={this.state.project.location} onChange={this.setLocation} name='location' />
                </label>
                <label>
                  Update Photo:
                  <input type='file' name='file' onChange={this.uploadPhoto} />
                </label>
                  <button type='submit' className='addProjectBtn'>Submit</button>
              </form>
            </div>
            <div className='column is-three-quarters' id='projectImage'>
              <img src={project.photoURL}></img>
            </div>
          </div>
        </span>
      );
    }


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

    let project = this.state.project
    // console.log(url)
      return ( 
        <div> {viewCheck()} </div>
      );
    }
  }


ReactDOM.render(<Project />, document.getElementById('project'));
