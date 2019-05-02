import React from 'react';
import ReactS3 from 'react-s3';
import axios from 'axios';

// import {aws} from './keys'
const akid = process.env.AWSAccessKeyId
const asak = process.env.AWSSecretKey
const s3Bucket = 'chaffmap'
const times = ['12:00 am', '3:00 am', '6:00 am', '9:00 am', '12:00 pm', '3:00 pm', '6:00 pm', '9:00 pm']
const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
const daysOfMonth = [1, 2, 3, 4, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31]
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']


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
    this.setLocation = this.setLocation.bind(this)
    this.setFrequencyCategory = this.setFrequencyCategory.bind(this)
    this.setFrequencyMoment = this.setFrequencyMoment.bind(this)
    this.state = {
      loading: false,
      file: null,
      name: '',
      material: '',
      location: '',
      items: [],
      amount: '',
      path: window.location.pathname,
      frequency: {
        category:'',
        moment: ''
      },
    };
  }

  componentDidMount() {
    const user = this.state.path.replace('/catalog/user/profile/', '')
console.log(user)
  }

  async postWaste() {
    const trimFront = this.state.path.replace('/catalog/user/profile/', '')
    const user = trimFront.replace('/addWaste', '')

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
  setMaterial(event){
    this.setState({material: event.target.value});
    console.log(this.state.material)
  }
  setFrequencyCategory(event){
    switch(event.target.value){
      case 'daily':
        this.setState({frequency: {category: 'daily'}})
      break;
      case 'weekly':
        this.setState({frequency: {category: 'weekly'}})
      break;
      case 'monthly':
        this.setState({frequency: {category: 'monthly'}})
      break;
      case 'yearly':
        this.setState({frequency: {category: 'yearly'}})
      break;
    }
    
    console.log(this.state.frequency)
  }
  setFrequencyMoment(event){
    this.setState({frequency: {
      category: this.state.frequency.category,
      moment: event.target.value}})
    console.log('in frequency moment', this.state.frequency)
  }

  setAmount(event){
    this.setState({amount: event.target.value});
    console.log(this.state.amount)
  }

  setLocation(event){
    this.setState({location: event.target.value});
    console.log(this.state.location)
  }

  testFunction(){
    return (
      <h1 style={{ outline: '5px solid magenta' }}>halfjalewkjf</h1>
    )
  }
  
  
  renderFrequencyDropdown() {
    console.log('frequency in renderFrequencyDropdown', this.state.frequency)
    let items
    switch(this.state.frequency.category){
      case 'daily':
        items = times.map(time => { return {value: time, display: time} })
        return (
          <div id='timeDropDown'> Time of Day<br></br>
            <select name="time" onChange={this.setFrequencyMoment}>
              {items.map((item) => {
                return (
                  <option  key={item.value} value={item.value}>
                    {item.display}
                  </option>
                )
              })}
            </select>
          </div>
        )
        break;
      case 'weekly':
        items = daysOfWeek.map(time => { return {value: time, display: time} })
        return (
          <div id='timeDropDown'> Day of Week<br></br>
            <select name="time" onChange={this.setFrequencyMoment}> 
              {items.map((item) => {
                return (
                  <option key={item.value} value={item.value}>
                    {item.display}
                  </option>
                )
              })}
            </select>
          </div>
        )
        break;
      case 'monthly':
        items = daysOfMonth.map(time => { return {value: time, display: time} })
        return (
          <div id='timeDropDown'> Day of Month <br></br>
            <select name="time" onChange={this.setFrequencyMoment}>
              {items.map((item) => {
                return (
                  <option key={item.value} value={item.value}>
                    {item.display}
                  </option>
                )
              })}
            </select>
          </div>
        )
      break;
      case 'yearly':
        items = months.map(time => { return {value: time, display: time} })
          return (
            <div id='timeDropDown'> Month <br></br>
            {/* <label htmlFor='frequencyMoment'> */}
              <select name="time" onChange={this.setFrequencyMoment}>
                {items.map((item) => {
                  return (
                    <option key={item.value} value={item.value}>
                      {item.display}
                    </option>
                  )
                })}
              </select>
              {/* </label> */}
            </div>
          )
      break;
    }
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

    // let url = this.state.url
    // console.log(url)
      return ( 
        <span>
            <br></br>
            <div id='uploadWasteBlock'>
             <h2> Share your byproducts!</h2> 
             <br></br>
          <form onSubmit={this.postWaste} method='POST' encType='multipart/form-data'>
                <label htmlFor='name'>
                  {/* Name:&nbsp; */}
                  <input type='text' placeholder='Name' defaultValue={this.state.name} onChange={this.setName} name='name' />
                  <p> What is it? <i> Chaff, Pallets, Rope</i> </p>
                </label>
                <br></br>
                  <label htmlFor='material'>
                    {/* Material:&nbsp; */}
                    <input type='text' placeholder='Material' defaultValue={this.state.material} onChange={this.setMaterial} name='material' />
                    <p> What is it made from, or out of? <i> Coffee Husks, Wood, Polyester</i> </p>
                  </label>
                <br></br>
                      <div id='frequencyInput'>
                        <label htmlFor='frequency'>
                          Frequency:
                          </label>
                          <br></br>
                          <div class='columns'>
                            <div id='radioInputs' class='column is-one-quarter'>
                              <input type='radio' value='daily' onChange={this.setFrequencyCategory} name='frequency' /> Daily  <br></br>
                              <input type='radio' value='weekly' onChange={this.setFrequencyCategory} name='frequency' /> Weekly  <br></br>
                              <input type='radio' value='monthly' onChange={this.setFrequencyCategory} name='frequency' /> Monthly  <br></br>
                              <input type='radio' value='yearly' onChange={this.setFrequencyCategory} name='frequency' /> Yearly  <br></br>
                            </div>
                            <div id='helptext' class='column'>
                              <p> How often do you toss this?</p>
                            </div>
                          </div>
                      </div>
                    {this.renderFrequencyDropdown()}
                <label id='amount' htmlFor='amount'>
                  {/* Amount:&nbsp;  */}
                  <input id='frequencyInputAmountInput' type='number' placeholder='10' defaultValue={this.state.amount} onChange={this.setAmount} name='amount' />
                  &nbsp; lbs
                  <p> How much do you toss at a time?</p>
                </label>
                <br></br>
                  <label htmlFor='location'>
                    {/* Location:&nbsp;  */}
                    <input type='text' placeholder='Location' defaultValue={this.state.location} onChange={this.setLocation} name='location' />
                    <p> Where is this located?</p>
                  </label>
                <br></br>
                <div>
                  <label>
                    {indicatorText}&nbsp;<input type='file' id='addPhotoInput' name='file' onChange={this.addPhoto} />
                  </label>
                </div>
              <a href='user/profile'> <button type='submit' id='addWasteBtn'>Submit</button></a>
            </form>
          </div>

        </span>
      );
    }
  }


ReactDOM.render(<WasteInput />, document.getElementById('wasteInput'));
