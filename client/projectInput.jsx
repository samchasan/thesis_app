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


class ProjectInput extends React.Component {
  constructor(props) {
    super(props)
    this.postProject = this.postProject.bind(this)
    this.makeProject = this.makeProject.bind(this)
    this.setName = this.setName.bind(this)
    this.setMaterials = this.setMaterials.bind(this)
    this.setLocation = this.setLocation.bind(this)
    this.state = {
      loading: false,
      file: null,
      name: '',
      materials: '',
      location: '',
    };
  }

  // componentDidMount() {
  //   console.log('getting projects')
  //   axios.get('projectJSON')
  //   .then((res) => {
  //     console.log(res)
  //   })
  //   .catch((error) =>{
  //     console.log(error);
  //   })
  // }

  async postProject() {
    event.preventDefault();

    await this.setState({
      loading:true
    });

    // console.log(this.state)

    const file = this.state.file;
    // console.log(file)/
    ReactS3.uploadFile(file, config)
    .then( (data) => {
        console.log(data);
        const photoMeta = { 
            'bucket': data.bucket,
            'key': data.key,
            'location': data.location
          }
        const formInput = {
          'photo': photoMeta,
          'text': this.state
        }
    var jsonse = JSON.stringify(formInput);
    var blob = new Blob([jsonse], {type: "application/json"});
    // console.log(jsonse)
      axios.post('addProject', blob, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
    })
    .then(function (response) {
      console.log(response)
      window.location = 'profile'
    })
    .catch ( (err) => {
      alert(err)
    })
  }

  async makeProject(event) {
    await this.setState({
      loading:true,
      file: event.target.files[0]
    });

    this.setState({
      loading: false,
      uploaded: true
    });
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

    if (this.state.loading) {
      indicatorText = 'Uploading file...'
    } else if (this.state.uploaded) {
      indicatorText = 'Uploaded'
    } else {
      indicatorText = 'Add a Project'
    }

    let url = this.state.url
    console.log(url)
      return ( 
        <span>
          <div id='project'>
            <img src={url}></img>
          </div>
            <div id='uploadProjectBlock'>
              {indicatorText}
          <form onSubmit={this.postProject} method='POST' encType='multipart/form-data'>

          <label htmlFor='name'>
            Name:
          <input type='text' placeholder='my fun project' defaultValue={this.state.name} onChange={this.setName} name='name' />
          </label>
          <label htmlFor='materials'>
            Materials:
          <input type='text' placeholder='wood, paint' defaultValue={this.state.materials} onChange={this.setMaterials} name='materials' />
          </label>
          <label htmlFor='location'>
            Location:
          <input type='text' placeholder='street' defaultValue={this.state.location} onChange={this.setLocation} name='location' />
          </label>
          <div>
            <label>
            Photo:
            <input type='file' name='file' onChange={this.makeProject} />
            </label>
            </div>
            <button type='submit' className='addProjectBtn'>Submit</button>
            </form>
            </div>

        </span>
      );
    }
  }


ReactDOM.render(<ProjectInput />, document.getElementById('projectInput'));
