import React from 'react';
import ReactS3 from 'react-s3';
import axios from 'axios';

const akid = process.env.AWSAccessKeyId
const asak = process.env.AWSSecretKey
const s3Bucket = 'chaffmap'

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
    this.addPhoto = this.addPhoto.bind(this)
    this.setName = this.setName.bind(this)
    this.setMaterials = this.setMaterials.bind(this)
    this.setLocation = this.setLocation.bind(this)
    // this.setFoundHere = this.setFoundHere.bind(this)
    this.state = {
      loading: false,
      file: null,
      name: '',
      materials: '',
      location: '',
      foundHere: false,
      givers: [],
      path: window.location.pathname,
    };
  }

  componentDidMount() {
    const user = this.state.path.replace('/catalog/user/profile/', '')
    console.log(user)
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

  async postProject() {
    const trimFront = this.state.path.replace('/catalog/user/profile/', '')
    const user = trimFront.replace('/addProject', '')

    event.preventDefault();

    await this.setState({
      loading:true
    });

    console.log('posting project')

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
          window.location = `../${user}`
          console.log(response)
        })
    .catch ( (err) => {
      alert(err)
    })
    console.log(user)

  }

  async addPhoto(event) {
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

  // setFoundHere(event){
  //   if (event.target.value === 'yes'){
  //   this.setState({foundHere: true});
  //   console.log(this.state.foundHere)
  //   } else{
  //   console.log(this.state.foundHere)
  //  }
  // }


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
      indicatorText = 'Add a photo'
    }

  const listGivers = () => {
      if (this.state.foundHere){
        axios.get('giversJSON')
          .then((res) => {      
            res.data.giver.forEach((giver) => { 
            this.state.giver.push(giver)
            // console.log(res.data)
          })
            console.log(this.state.giver)
            this.setState({
              giversLoaded: true
            })
          })
          .catch((err) => {
            console.log(err);
          })
    
      }

    }

    

    // let url = this.state.url
    // console.log(url)
      return ( 
        <span>
            <br></br>
            <div id='uploadProjectBlock'>
             <h2> Share your Project!</h2> 
             <br></br>
          <form onSubmit={this.postProject} method='POST' encType='multipart/form-data'>
                <label htmlFor='name'>
                  {/* Name:&nbsp; */}
                  <input type='text' placeholder='Name' defaultValue={this.state.name} onChange={this.setName} name='name' />
                  <p> What is it? <i> Art, Apparel, Tool</i> </p>
                </label>
                <br></br>
                  <label htmlFor='materials'>
                    {/* Materials:&nbsp; */}
                    <input type='text' placeholder='Materials' defaultValue={this.state.materials} onChange={this.setMaterials} name='materials' />
                    <p> What is it made from, or out of? <i> Coffee Husks, Wood, Polyester</i> </p>
                  </label>
                <br></br>
                {/* <label htmlFor='foundHere'>
                  <input onChange={this.setFoundHere} type='radio' name='foundHere' value='yes'/> Yes
                  <input onChange={this.setFoundHere} type='radio' name='foundHere' value='no'/> No
                  <p> Did you find this here? <i> If so select a giver</i> </p>
                    {listGivers()}
                </label>   */}
                <br></br>
                  <label htmlFor='location'>
                    {/* Location:&nbsp;  */}
                    <input type='text' placeholder='Location' defaultValue={this.state.location} onChange={this.setLocation} name='location' />
                    <p> Where is this project located?</p>
                  </label>
                <br></br>
                <div>
                  <label>
                    {indicatorText}&nbsp;<input type='file' id='addPhotoInput' name='file' onChange={this.addPhoto} />
                  </label>
                </div>
              <a href='user/profile'> <button type='submit' id='addProjectBtn'>Submit</button></a>
            </form>
          </div>

        </span>
      );
    }
  }


ReactDOM.render(<ProjectInput />, document.getElementById('projectInput'));
