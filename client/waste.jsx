import React from 'react';
import ReactS3 from 'react-s3';
import axios from 'axios';
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


class Waste extends React.Component {
  constructor(props) {
    super(props)
    this.postWaste = this.postWaste.bind(this)
    this.editWaste = this.editWaste.bind(this)
    this.stopEditing = this.stopEditing.bind(this)
    this.delete = this.delete.bind(this)
    this.uploadPhoto = this.uploadPhoto.bind(this)
    this.setTitle = this.setTitle.bind(this)
    this.setMaterial = this.setMaterial.bind(this)
    this.setLocation = this.setLocation.bind(this)
    this.setDescription = this.setDescription.bind(this)
    this.setFrequencyCategory = this.setFrequencyCategory.bind(this)
    this.setFrequencyMoment = this.setFrequencyMoment.bind(this)
    this.renderFrequencyDropdown = this.renderFrequencyDropdown.bind(this)
    this.setAmount = this.setAmount.bind(this)
    this.componentDidMount = this.componentDidMount.bind(this)

    this.state = {
      loading: false,
      // file: null,
      // url: 'http://www.clker.com/cliparts/3/m/v/Y/E/V/small-red-apple-hi.png',
      title: '',
      material: '',
      location: '',
      frequency:{},
      amount: '',
      path: window.location.pathname,
      file:'',
      waste: {
        location: '',
        material: '',
        photoURL: '',
        title: '',
        frequency: {},
        amount: '',
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

    console.log('waste js mounted')
    const url = `${this.state.path}/singleWasteJSON`
    axios.get(url)
    .then(function (res) {
      console.log('axios got url', res);
      const waste = res.data.waste
      console.log('got waste', waste)
      currentComponent.setState({waste: {
        title: waste.title,
        // location: waste.location.address,
        material: waste.material,
        frequency: waste.frequency,
        amount: waste.amount,
        photoURL: waste.photo.url,
        key: waste.photo.key,
        userID: waste.userID,
        username: waste.username,
        id: waste._id,
        description: waste.description
      }})
      console.log(currentComponent.state.waste)

      if(res.data.currentUser){
        const user = res.data.currentUser
        console.log('user found', user)
        if (user._id === waste.userID){
          currentComponent.setState({isOwner:true})
          console.log(currentComponent.state.isOwner)

        }
      }

    })
    .catch(function (error) {
      console.log(error);
    })
  }


  async postWaste() {
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
      axios.post(`${currentComponent.state.waste.id}`, blob, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
    })
    .then( () => {
      console.log('window.location', window.location)
      window.location = currentComponent.state.waste.id
    })
    .catch ( (err) => {
      console.log(err)
    })
    }else if (!currentComponent.state.file){
      console.log('no file, posting without photo')
      // debugger
      const jsonse = JSON.stringify({'text': currentComponent.state});
      const blob = new Blob([jsonse], {type: "application/json"});
      axios.post(`${currentComponent.state.waste.id}`, blob, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
    .then( () => {
      window.location = currentComponent.state.waste.id
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

  editWaste(){
    this.setState({editing: true})
    console.log(this.state.editing)
  }

  stopEditing(){
    this.setState({editing: false})
    console.log(this.state.editing)
  }

  setTitle(event){
    this.setState({title: event.target.value});
    console.log(this.material)
  }
  setMaterial(event){
    this.setState({material: event.target.value});
    console.log(this.state.material)
  }
  setLocation(event){
    this.setState({location: event.target.value});
    console.log(this.state.location)
  }
  setDescription(event){
    this.setState({description: event.target.value});
    console.log(this.state.description)
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

 
  delete(){

    console.log('deleting')

    axios.post(`${this.state.path}/deleteWaste`)
    .then((res) => {     
      console.log('res', res)
      window.location = `../../${this.state.waste.username}`
    })
    .catch((err) => {
      console.log(err);
    })  
    
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
          <button class='button is-small is-link' onClick={this.editWaste}> edit </button>
        )
      } else {
        return (
          <a class='button is-small is-link' href='../../../../login'> login to edit </a> 
        )
      }
    }

    const checkDescription = () =>  {
      if(this.state.waste.description){ 
        return (
          <div>
          Description: <br></br>
          <p> {waste.description} </p>        
          </div>
          )
      } else {
        return (
          <div>
          <p> <a onClick={this.editWaste} > Add a description </a> </p> 
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


    const frequencyIndicator = (waste) => {
      if(waste.frequency){
        console.log('frequency indicator', waste)
        return(
          <span>{`${capitalize(waste.frequency.category)} ${insertText(waste.frequency.category)} ${waste.frequency.moment}`}</span>
        )
      } 
    }


    const staticView = () => { 
      return (
        <div id='staticView'>
          <div className='columns' id='wasteInfoBox'>
            <div className='column is-one-quarter' id='wasteInfo'>
            <h3 class="title is-3"> {capitalize(waste.title)}</h3>
                  {/* NEED TO ADD LINKS THAT GO TO SEARCH PAGE HERE FOR MATERIAL AND LOCATION */}
              <p class="subtitle is-5">{`${waste.amount} lbs`} | {frequencyIndicator(waste)} </p>
              <p>{`Material: `} <a> {waste.material}</a></p>
              <p>{`Located: `}  <a> {waste.location} </a> </p>
              <p> {`Producer: `} <a href={`../../${waste.username}`}> {waste.username} </a> </p>
                 
              <div className='columns'>
                <div className='column is-two-quarters' id='editControls'> {editButton()}</div>
                <div className='column is-one-quarter' id='deleteButton'>{deleteButton()}</div>
              </div>
              <div id='wasteDescription'>
              {checkDescription()}
              </div>
            </div>
            <div className='column is-three-quarters' id='wasteImage'>
              <img src={waste.photoURL}></img>
            </div>
          </div>
         
        </div>
    )}

    const editView = () => { 
      return ( 
        <span>
          <div className='columns' >
            <div className='column is-one-quarter' id='wasteInfo'>
              <form method='POST' encType='multipart/form-data'>
                <label htmlFor='title'>
                  Title:
                  <input type='text' placeholder={this.state.waste.title} defaultValue={this.state.waste.title} onChange={this.setTitle} name='name' />
                </label>
                <label htmlFor='material'>
                  Material:
                  <input type='text' placeholder={this.state.waste.material} defaultValue={this.state.waste.material} onChange={this.setMaterial} name='material' />
                </label>
                <label htmlFor='location'>
                  Location:
                  <input type='text' placeholder={this.state.waste.location} defaultValue={this.state.waste.location} onChange={this.setLocation} name='location' />
                </label>
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
                <label htmlFor='description'>
                  Description:
                  <textarea rows="10" cols="19" placeholder={this.state.waste.description} defaultValue={this.state.waste.description} onChange={this.setDescription} name='description' />
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
                      onClick={this.postWaste}> Update Waste
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
            <div className='column is-three-quarters' id='wasteImage'>
              <img src={waste.photoURL}></img>
            </div>
          </div>
        </span>
      );
    }

    const capitalize = (s) => {
      if (typeof s !== 'string') return ''
      return s.charAt(0).toUpperCase() + s.slice(1)
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

    let waste = this.state.waste
    // console.log(url)
      return ( 
        <div> {viewCheck()} </div>
      );
    }
  }


ReactDOM.render(<Waste />, document.getElementById('waste'));
