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

function isEmpty(obj) {
  for (var key in obj) {
    if (obj.hasOwnProperty(key))
      console.log('obj', obj)
      return true;
  }
  return false;
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
      frequencyView: {},
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
      
      let addr = ''
      const coords = {lat: '', lng: ''}
      let location


      if(!waste.location){
        location = {address: addr, location: coords}
      } else {
        location = waste.location
      }



      currentComponent.setState({waste: {
        title: waste.title,
        location: location,
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
        this.setState({
          frequency: {category: 'daily'}}, )
      break;
      case 'weekly':
        this.setState({
          frequency: {category: 'weekly'},
          frequencyView:{view: 'boxes', value:'7'}
        })
        // debugger
      break;
      case 'monthly':
        this.setState({
          frequency: {category: 'monthly'},
          frequencyView:{view: 'calendar', value:'31'}
        })
      break;
      case 'yearly':
        this.setState({frequency: {category: 'yearly'},
        frequencyView:{view: 'boxes', value:'12'}
      })
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
      if(this.state.isOwner){
      if(this.state.waste.description){ 
        return (
          <div>
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
    }else {
      return (
        <div>
        <p> No description! </p> 
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
    let tablemade = false

       const frequencyVisual = (category, moment) =>  {

        // debugger

        switch (category){
          case'daily':
            return (
            <div id='dailyView'>
                <table className='table'>
                  <thead>
                      <tr>
                        <th id='12:00 am'><abbr title="12a"></abbr>12 am</th>
                        <th id='3:00 am'><abbr title="3a"></abbr>3 am</th>
                        <th id='6:00 am'><abbr title="6a"></abbr>6 am</th>
                        <th id='9:00 am'><abbr title="9a"></abbr>9 am</th>
                        <th id='12:00 pm' ><abbr title="12p"></abbr>12 pm</th>
                        <th id='3:00 pm'><abbr title="3p"></abbr>3 pm</th>
                        <th id='6:00 pm'><abbr title="6p"></abbr>6 pm</th>
                        <th id='9:00 pm'><abbr title="9p"></abbr>9 pm</th>
                      </tr>
                    </thead>
                </table>
              </div>            )
          break;
          case 'weekly':
              tablemade = true
          return (
            <div id='weekView'>
              <table className='table'>
                <thead>
                    <tr>
                      <th id='Sunday'><abbr title="Sunday"></abbr>Su</th>
                      <th id='Monday'><abbr title="Monday"></abbr>M</th>
                      <th id='Tuesday'><abbr title="Tuesday"></abbr>T</th>
                      <th id='Wednesday'><abbr title="Wednesday"></abbr>W</th>
                      <th id='Thursday' ><abbr title="Thursday"></abbr>Th</th>
                      <th id='Friday'><abbr title="Friday"></abbr>F</th>
                      <th id='Saturday'><abbr title="Saturday"></abbr>Sa</th>
                    </tr>
                  </thead>
              </table>
            </div>
          )

          break;
          case 'monthly':
          return (
            <div id='monthView'>
              <table className='table'>
                <thead>
                    <tr>
                      <th id='1'><abbr title="1"></abbr>1</th>
                      <th id='2'><abbr title="2"></abbr>2</th>
                      <th id='3'><abbr title="3"></abbr>3</th>
                      <th id='4'><abbr title="5"></abbr>4</th>
                      <th id='5' ><abbr title="5"></abbr>5</th>
                      <th id='6'><abbr title="6"></abbr>6</th>
                      <th id='7'><abbr title="7"></abbr>7</th>
                      <th id='8'><abbr title="8"></abbr>8</th>

                    </tr>
                    <tr>
                      <th id='9'><abbr title="9"></abbr>9</th>
                      <th id='11'><abbr title="11"></abbr>10</th>
                      <th id='12'><abbr title="12"></abbr>12</th>
                      <th id='13' ><abbr title="13"></abbr>13</th>
                      <th id='14'><abbr title="14"></abbr>14</th>
                      <th id='15'><abbr title="15"></abbr>15</th>
                      <th id='16'><abbr title="16"></abbr>16</th>
                      <th id='17'><abbr title="17"></abbr>17</th>
                    </tr>
                    <tr>
                      <th id='18'><abbr title="18"></abbr>18</th>
                      <th id='19'><abbr title="19"></abbr>19</th>
                      <th id='20'><abbr title="20"></abbr>20</th>
                      <th id='21' ><abbr title="21"></abbr>21</th>
                      <th id='22'><abbr title="22"></abbr>22</th>
                      <th id='23'><abbr title="23"></abbr>23</th>
                      <th id='24'><abbr title="24"></abbr>24</th>
                      <th id='25' ><abbr title="25"></abbr>25</th>                    </tr>
                    <tr id='lastRow'>
                      <th id='26'><abbr title="26"></abbr>26</th>
                      <th id='27'><abbr title="27"></abbr>27</th>
                      <th id='28'><abbr title="28"></abbr>28</th>
                      <th id='29'><abbr title="29"></abbr>29</th>
                      <th id='30'><abbr title="30"></abbr>30</th>
                      <th id='31'><abbr title="31"></abbr>31</th>
                      <th id='null'><abbr title="null"></abbr></th>
                      <th id='null'><abbr title="null"></abbr></th>
                    </tr>
                  </thead>
              </table>
            </div>          )

          break;
          case 'yearly' :
            return (
              <div id='yearView'>
              <table className='table'>
                <thead>
                    <tr>
                      <th id='January'><abbr title="January"></abbr>JAN</th>
                      <th id='February'><abbr title="February"></abbr>FEB</th>
                      <th id='March'><abbr title="March"></abbr>MAR</th>
                      <th id='April'><abbr title="April"></abbr>APR</th>
                      <th id='May'><abbr title="May"></abbr>MAY</th>
                      <th id='June'><abbr title="June"></abbr>JUN</th>
                      <th id='July'><abbr title="July"></abbr>JUL</th>
                      <th id='August'><abbr title="August"></abbr>AUG</th>
                      <th id='September'><abbr title="September"></abbr>SEP</th>
                      <th id='October'><abbr title="October"></abbr>OCT</th>
                      <th id='November'><abbr title="November"></abbr>NOV</th>
                      <th id='December'><abbr title="December"></abbr>DEC</th>
                    </tr>
                  </thead>
              </table>
            </div>
            )
          break;
        } 
    }



    const frequencyIndicator = (waste) => {
      if(waste.frequency){
        if(!isEmpty(waste.frequency.moment)){
          console.log('frequency indicator', this.state)
          const visuals = frequencyVisual(waste.frequency.category,waste.frequency.moment)
          return(
            <span>
                  {visuals}
            </span>
          )
        }
        // return(
        // <span>{`${capitalize(waste.frequency.category)} 
        //         ${checkFreqMoment(waste.frequency.moment)}`}
        // </span>
        // )
        } else {
        return null
      }
    }

      const checkFreqMoment = (obj) =>  {
      if(obj){ 
        return obj
      }else{
        return ''
      }
    }

    


    const checkAmount = () =>  {
      if(this.state.waste.amount){ 
        // console.log(this.state.waste.location)
        return (
          `${waste.amount} lbs |`
        )
      }else{
        return null
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
          <p> <a href={`https://www.google.com/maps/place/${location.address}`}> {location.address} </a> </p>
        )
      }
    }


    const staticView = () => { 
      return (
        <div >
          <div className='back-nav'>
          <div className='container'>
            <p> <a href={`../../${waste.username}`}> {waste.username}</a>'s byproduct </p>
          </div>
          </div>
        <div id='staticView' className='container'>
          <div className='columns' id='wasteInfoBox'>
            <div className='column' id='wasteInfo'>
              <div id='singleItemTitle'className='level'>
                <h3 class="title is-3 level-left"> {capitalize(waste.title)}</h3>
                <h5 class="subtitle is-5 level-right">{checkAmount()} {capitalize(waste.frequency.category)}</h5>
              </div>
              <div id='frequencyView'>
              {frequencyIndicator(waste)}
              </div>
              <div id='singleItemText'>
                <p id='address'>{checkLocation(waste.location)}  </p>                 
                <div id='itemDescription'>
                  {checkDescription()}
                </div>
                <hr></hr>
                  <b>Item details:</b> 
                <p><a> {waste.material}</a></p>
              </div>
            </div>
            <div className='column' id='wasteImage'>
              <img src={waste.photoURL}></img>
            </div>
          </div>
          </div>        
        </div>
    )}


    const highlightFrequencyMoment = () => {
      if(tablemade){
      const moment = JSON.stringify(waste.frequency.moment)

      const boxesToHighlight = document.getElementById("Thursday")
      // boxesToHighlight.style.backgroundColor = 'red'
      console.log('boxesToHighlight', boxesToHighlight)
      }
    }

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
                  <input type='text' placeholder={this.state.waste.location.address} defaultValue={this.state.waste.location.address} onChange={this.setLocation} name='location' />
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

    highlightFrequencyMoment()

    return ( 
         <div> {viewCheck()} </div>
      );
    }
  }


ReactDOM.render(<Waste />, document.getElementById('waste'));
