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


class AvatarInput extends React.Component {
  constructor(props) {
    super(props)
    this.postAvatar = this.postAvatar.bind(this)
    this.makeAvatar = this.makeAvatar.bind(this)
    this.componentDidMount = this.componentDidMount.bind(this)
    this.state = {
      loading: false,
      file: null,
      url: 'http://www.clker.com/cliparts/3/m/v/Y/E/V/small-red-apple-hi.png'
    };
  }

  componentDidMount() {
    let currentComponent = this;
    console.log('getting avatar')
    axios.get('avatarJSON')
    .then((res) => {
      const data = JSON.parse(res.data)
            console.log(data)

      currentComponent.setState({
        url: data.url
      })
    })
    .catch((error) => {
      console.log(error);
    })
  }

  async postAvatar() {
    event.preventDefault();

    this.setState({
      loading:true
    });

    const file = this.state.file;
    console.log(file)
    ReactS3.uploadFile(file, config)
    .then( (data) => {
        console.log(data);
        const metadata = { 
            'bucket': data.bucket,
            'key': data.key,
            'location': data.location
          }
        this.setState({
          url: data.location
        })
    var jsonse = JSON.stringify(metadata);
    var blob = new Blob([jsonse], {type: "application/json"});
      axios.post('postAvatar', blob, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
    })
    .catch ( (err) => {
      alert(err)
    })
  }

  async makeAvatar(event) {
    await this.setState({
      loading:true,
      file: event.target.files[0]
    });

    this.setState({
      loading: false,
      uploaded: true
    });
  }
  
  render() {
    let indicatorText;

    if (this.state.loading) {
      indicatorText = 'Uploading file...'
    } else if (this.state.uploaded) {
      indicatorText = 'Uploaded'
    } else {
      indicatorText = 'Add a file'
    }

    let url = this.state.url
    console.log(url)
      return ( 
        <span>
          <div id='avatar'>
            <img src={url}></img>
          </div>
            <div id='uploadAvatarBlock'>
              {indicatorText}
          <form onSubmit={this.postAvatar} method='POST' encType='multipart/form-data'>
          <div>
          <input type='file' name='file' onChange={this.makeAvatar} />
            </div>
            <button type='submit' className='addBtn'>Submit</button>
            </form>
            </div>

        </span>
      );
    }
  }


ReactDOM.render(<AvatarInput />, document.getElementById('avatarInput'));
