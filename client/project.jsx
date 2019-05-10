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
    this.stopEditing = this.stopEditing.bind(this)
    this.delete = this.delete.bind(this)
    this.uploadPhoto = this.uploadPhoto.bind(this)
    this.setName = this.setName.bind(this)
    this.setMaterials = this.setMaterials.bind(this)
    this.setLocation = this.setLocation.bind(this)
    this.setDescription = this.setDescription.bind(this)
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
        id: '',
        description: ''
      },
      isOwner: false,
      editing: false

    };
  }

  componentDidMount() {
    let currentComponent = this;
    console.log(currentComponent.state)

    console.log('project js mounted')
    const url = `${this.state.path}/singleProjectJSON`
    axios.get(url)
    .then(function (response) {
      console.log('axios got url', response);
      const project = response.data.project
      console.log('got project', project)

      let location = ''
      let materials = ''
      let description = ''


function isEmpty(obj) {
  for (var key in obj) {
    if (obj.hasOwnProperty(key))
      return false;
  }
  return true;
}

      if(!isEmpty(project.location)){
        console.log('project location', project.location)
        location = project.location
         }else{
         console.log('no location')
       }

       if(project.materials){
        console.log('project location', project.location)
        materials = project.materials
         }else{
         console.log('no location')
       }

       if(project.description){
        console.log('project location', project.description)
        description = project.description
         }else{
         console.log('no location')
       }

      currentComponent.setState({project: {
        location: location,
        materials: materials,
        photoURL: project.photo.url,
        title: project.title,
        key: project.photo.key,
        userID: project.userID,
        username: project.username,
        id: project._id,
        description: description
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

    console.log('getting component to post', currentComponent.state)

    if(currentComponent.state.file){
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
      const jsonse = JSON.stringify(formInput);
      const blob = new Blob([jsonse], {type: "application/json"});
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
    }else if (!currentComponent.state.file){
      console.log('no file, posting without photo')
      // debugger
      const jsonse = JSON.stringify({'text': currentComponent.state});
      const blob = new Blob([jsonse], {type: "application/json"});
      axios.post(`${currentComponent.state.project.id}`, blob, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
    .then( () => {
      window.location = currentComponent.state.project.id
      console.log('window.location', window.location)
    })
    .catch ( (err) => {
      console.log(err)
    })
  }
  }
  

  async uploadPhoto(event) {
    await this.setState({
      loading:true,
      file: event.target.files[0]
    });
    console.log(this.state.file.name)
    this.setState({
      loading: false,
      uploaded: true
    });
  }

  editProject(){
    this.setState({editing: true})
    console.log(this.state.editing)
  }

  stopEditing(){
    this.setState({editing: false})
    console.log(this.state.editing)
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
  setDescription(event){
    this.setState({description: event.target.value});
    console.log(this.state.description)
  }

  delete(){

    console.log('deleting')

    axios.post(`${this.state.path}/deleteProject`)
    .then((res) => {     
      console.log('res', res)
      window.location = `../${this.state.project.username}`
    })
    .catch((err) => {
      console.log(err);
      window.location = `../${this.state.project.username}`
    })  
    
  }


  render() {
    let indicatorText;
    let currentComponent = this

    if (this.state.loading) {
      indicatorText = 'Uploading file...'
    } else if (this.state.uploaded) {
      indicatorText = this.state.file.name
    } else {
      indicatorText = 'Update Photo'
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
          <button class='button is-small is-link' onClick={this.editProject}> edit </button>
        )
      } else {
        return (
          <a class='button is-small is-link' href='../../../login'> login to edit </a> 
        )
      }
    }

    const checkDescription = () =>  {
      if(this.state.project.description){ 
        return (
          <div>
          <p> {project.description} </p>        
          </div>
          )
      } else {
        return (
          <div>
          <p> <a onClick={this.editProject} > Add a description </a> </p> 
          </div>

        )
      }
    }

    const deleteButton = () => {
      if(this.state.isOwner === true){
      return (
        <button onClick={this.delete} class='button is-small is-danger'>
        <span class="icon is-small">
        <i class="fas fa-trash-alt">
          </i>
          </span>
      </button>
      )
      }
    }


    const staticView = () => { 
      return (
        <div id='staticView'>
          <div className='columns' id='projectInfoBox'>
            <div className='column is-one-quarter' id='projectInfo'>
                  <h2> {project.title}</h2>
              <p>{`Made with ${project.materials}`}</p>
              <p>{`Found ${insertText(project.location.address)} ${project.location.address}`}</p>
              <p> By&nbsp; <a href={`../${project.username}`}> {project.username} </a> </p>
              <div className='columns'>
                <div className='column is-two-quarters' id='editControls'> {editButton()}</div>
                <div className='columns is-one-quarter' />
                <div className='column is-one-quarter' id='deleteButton'>{deleteButton()}</div>
              </div>
              <div id='projectDescription'>
                {checkDescription()}
              </div>
            </div>
            <div className='column is-three-quarters' id='projectImage'>
              <img src={project.photoURL}></img>
            </div>
          </div>
        </div>
    )}

    const editView = () => { 
      return ( 
        <span>
          <div className='columns' >
            <div className='column is-one-quarter' id='projectInfo'>
              <form method='POST' encType='multipart/form-data'>
                <label htmlFor='title'>
                  Title:
                  <input type='text' placeholder={this.state.project.title} defaultValue={this.state.project.title} onChange={this.setName} name='name' />
                </label>
                <label htmlFor='materials'>
                  Made With:
                  <input type='text' placeholder={this.state.project.materials} defaultValue={this.state.project.materials} onChange={this.setMaterials} name='materials' />
                </label>
                <label htmlFor='location'>
                  Found at:
                  <input type='text' placeholder={this.state.project.location.address} defaultValue={this.state.project.location.address} onChange={this.setLocation} name='location' />
                </label>
                <label htmlFor='description'>
                  Description:
                  <textarea rows="10" cols="19" placeholder={this.state.project.description} defaultValue={this.state.project.description} onChange={this.setDescription} name='description' />
                </label>
                <label>
                  {indicatorText}
                  <div id='addPhotoInput'>
                    <input type='file' name='file' onChange={this.uploadPhoto} />
                  </div>
                </label>
                 

                <div className='columns'>
                  <div className='column is-two-quarters' >
                      <a type='button' class='button is-medium is-primary' 
                      onClick={this.postProject}> Update Project
                      </a>
                  </div>
                  <div className='columns is-one-quarter'> 
                      <a type='button' class="button is-small is-danger" 
                      onClick={this.stopEditing}> Cancel 
                      </a>
                  </div>
                  <div className='column is-one-quarter' id='deleteButton'>
                    {deleteButton()}
                  </div>
                </div>
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
