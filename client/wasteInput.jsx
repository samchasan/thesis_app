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


class WasteInput extends React.Component {
  constructor(props) {
    super(props)
    this.postWaste = this.postWaste.bind(this)
    this.addPhoto = this.addPhoto.bind(this)
    this.setName = this.setName.bind(this)
    this.setMaterial = this.setMaterial.bind(this)
    this.setAmount = this.setAmount.bind(this)
    this.setFrequency = this.setFrequency.bind(this)

    this.state = {
      loading: false,
      file: null,
      name: '',
      material: '',
      amount: '',
      frequency: '',
    };
  }

  async postWaste() {
    event.preventDefault();

    await this.setState({
      loading:true
    });

    console.log('posting waste')

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
      axios.post('addWaste', blob, {
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
  setMaterial(event){
    this.setState({material: event.target.value});
    console.log(this.state.material)
  }
  setFrequency(event){
    switch(event.target.value){
      case 'daily':
        this.setState({frequency: {daily: true}})
      break;
      case 'weekly':
        this.setState({frequency: {weekly: true}})
      break;
      case 'monthly':
        this.setState({frequency: {monthly: true}})
      break;
    }
    // this.setState({frequency: event.target.value});
    console.log(this.state.frequency)
  }
  setAmount(event){
    this.setState({amount: event.target.value});
    console.log(this.state.amount)
  }
  

  render() {
    let indicatorText;

    if (this.state.loading) {
      indicatorText = 'Uploading file...'
    } else if (this.state.uploaded) {
      indicatorText = 'Uploaded'
    } else {
      indicatorText = 'Share your waste'
    }

    let url = this.state.url
    console.log(url)
      return ( 
        <span>
          <div id='waste'>
            <img src={url}></img>
          </div>
            <div id='uploadWasteBlock'>
              {indicatorText}
          <form onSubmit={this.postWaste} method='POST' encType='multipart/form-data'>
          <label htmlFor='name'>
            Name:
          <input type='text' placeholder='Tarp scraps' defaultValue={this.state.name} onChange={this.setName} name='name' />
          </label>
          <label htmlFor='material'>
            Material:
          <input type='text' placeholder='Plastic' defaultValue={this.state.material} onChange={this.setMaterial} name='material' />
          </label>
          <div id='frequencyInput'>
          <label htmlFor='frequency'>
          <input type='radio' value='daily' onChange={this.setFrequency} name='frequency' /> Daily  <br></br>
          <input type='radio' value='weekly' onChange={this.setFrequency} name='frequency' /> Weekly  <br></br>
          <input type='radio' value='monthly' onChange={this.setFrequency} name='frequency' /> Monthly  <br></br>
          </label>
          </div>
          <label htmlFor='amount'>
            Amount (in lbs):
          <input type='number' placeholder='10' defaultValue={this.state.amount} onChange={this.setAmount} name='amount' />
          </label>
          <div>
            <label>
            Photo:
            <input type='file' name='file' onChange={this.addPhoto} />
            </label>
            </div>
            <button type='submit' id='addWasteBtn'>Submit</button>
            </form>
            </div>

        </span>
      );
    }
  }


ReactDOM.render(<WasteInput />, document.getElementById('wasteInput'));
