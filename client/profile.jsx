import React from 'react';
import ReactS3 from 'react-s3';
import axios from 'axios';
const akid = process.env.AWSAccessKeyId;
const asak = process.env.AWSSecretKey;
const s3Bucket = 'chaffmap';

let hours = {
  monday: {
    isOpen: {type: Boolean, default: false},
    open: '',
    close: ''
  },
  tuesday: {
    isOpen: {type: Boolean, default: false},
    open: '',
    close: ''
  },
  wednesday: {
    isOpen: {type: Boolean, default: false},
    open: '',
    close: ''
  },
  thursday: {
    isOpen: {type: Boolean, default: false},
    open: '',
    close: ''
  },
  friday: {
    isOpen: {type: Boolean, default: false},
    open: '',
    close: ''
  },
  saturday: {
    isOpen: {type: Boolean, default: false},
    open: '',
    close: ''
  },
  sunday: {
    isOpen: {type: Boolean, default: false},
    open: '',
    close: ''
  }
}

const config = {
  bucketName: s3Bucket,
  region: 'us-east-2',
  accessKeyId: akid,
  secretAccessKey: asak
}


class Profile extends React.Component {
  constructor(props) {
    super(props)
    this.postProfile = this.postProfile.bind(this)
    this.editProfile = this.editProfile.bind(this)
    this.stopEditing = this.stopEditing.bind(this)
    this.delete = this.delete.bind(this)
    this.uploadPhoto = this.uploadPhoto.bind(this)
    this.setName = this.setName.bind(this)
    this.setLocation = this.setLocation.bind(this)
    this.setEmail = this.setEmail.bind(this)
    this.setPhone = this.setPhone.bind(this)
    this.setDescription = this.setDescription.bind(this)
    this.componentDidMount = this.componentDidMount.bind(this)

    this.state = {
      loading: false,
      name: '',
      location: {},
      path: window.location.pathname,
      file:'',
      url: '/img/blank-user-avatar.png',
      user: {
        location: {},
        username: '',
        email: '',
        id: '',
        description: '',
        avatarURL: ''
      },
      isOwner: false,
      isAdmin: false,
      isBusiness: false,
      editing: false

    };
  }

  componentDidMount() {
    let currentComponent = this;
    console.log('state', currentComponent.state)

    //console.log('user js mounted')
    const url = `${currentComponent.state.path}/userJSON`
    axios.get(url)
    .then(function (res) {
      // console.log('axios got url', res);
      const currentUser = res.data.user
      // const avatar = res.data.avatar
      let avatarURL = ''
      let isBusiness = false
      let description = ''
      let location = ''
      let phone = ''
      console.log('got user', currentUser)

        if(currentUser.location){
          console.log(currentUser.location)
          location = currentUser.location.address
           }else{
           console.log('no location')
         }

        if(currentUser.photo){
          console.log(currentUser.photo.location)
          avatarURL = currentUser.photo.location
        }else{
          console.log('no avatar')
        } 

        if(currentUser.description){
          console.log(currentUser.description)
            description = currentUser.description
            }else{
            console.log('no description')
          }  
         
        if(currentUser.isBusiness){
          console.log(currentUser.isBusiness)
            isBusiness = currentUser.isBusiness
          } else{
            console.log('not a business')
          }   

        if(currentUser.phone){
          console.log(currentUser.phone)
            phone = currentUser.phone
          } else{
            console.log('not a business')
          }   
        
      // debugger  
          
      currentComponent.setState({'user': {
        'email': currentUser.email,
        'username': currentUser.username,
        'id': currentUser._id,
        'description': description,
        'isBusiness': isBusiness,
        'avatarURL': avatarURL,
        'phone': phone,
        'location': {'address': location}
      }})

      console.log('user asssigned', currentComponent.state.user)

      // debugger

      if(res.data.currentUser){
        // const currentUser = res.data.currentUser
        // console.log('user loggin in', user)

        console.log('id1',res.data.activeUser._id)
        console.log('id2',currentComponent.state.user.id)


        if (res.data.activeUser._id === currentComponent.state.user.id){
          currentComponent.setState({isOwner:true})
          console.log(currentComponent.state.isOwner)

        }
      }

    })
    .catch(function (error) {
      //console.log(error);
    })
  }


  async postProfile() {
    let currentComponent = this;

    event.preventDefault();

    await this.setState({
      loading:true
    });

    //console.log('getting component to post', currentComponent.state)

    if(currentComponent.state.file){
    const file = currentComponent.state.file;
    ReactS3.uploadFile(file, config)
    .then( (data) => {
      // debugger
        //console.log(data);
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
      axios.post(`${currentComponent.state.user.id}`, blob, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      // const jsonsePhoto = JSON.stringify(photoMeta);
      // const blobPhoto = new Blob([jsonsePhoto], {type: "application/json"});
      // axios.post('postAvatar', blobPhoto, {
      //   headers: {
      //     'Content-Type': 'application/json'
      //   }
      // })
    })
    .then( () => {
      window.location = currentComponent.state.user.username
      //console.log('window.location', window.location)
    })
    .catch ( (err) => {
      //console.log(err)
    })
    }else if (!currentComponent.state.file){
      //console.log('no file, posting without photo')
      // debugger
      const jsonse = JSON.stringify({'text': currentComponent.state});
      const blob = new Blob([jsonse], {type: "application/json"});
      axios.post(`${currentComponent.state.user.id}`, blob, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
    .then( () => {
      window.location = currentComponent.state.user.username
      //console.log('window.location', window.location)
    })
    .catch ( (err) => {
      //console.log(err)
    })
  }
  }
  

  async uploadPhoto(event) {
    await this.setState({
      loading:true,
      file: event.target.files[0]
    });
    //console.log(this.state.file.name)
    this.setState({
      loading: false,
      uploaded: true
    });
  }

  editProfile(){
    this.setState({editing: true})
    //console.log(this.state.editing)
  }
  stopEditing(){
    this.setState({editing: false})
    //console.log(this.state.editing)
  }
  setName(event){
    this.setState({name: event.target.value});
    //console.log(this.state.name)
  }
  setEmail(event){
    this.setState({email: event.target.value});
    //console.log(this.state.name)
  }
  setPhone(event){
    this.setState({phone: event.target.value});
    //console.log(this.state.name)
  }
  setLocation(event){
    this.setState({location: {address: event.target.value}});
    //console.log(this.state.location)
  }
  setDescription(event){
    this.setState({description: event.target.value});
    //console.log(this.state.description)
  }

  delete(){
    //console.log('deleting')

    axios.post(`${this.state.path}/deleteUser`)
    .then((res) => {     
      //console.log('res', res)
      window.location = `../../`
    })
    .catch((err) => {
      //console.log(err);
      window.location = `../../`
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
      if(this.state.editing){
        return (
          <div>{editView()}</div>
        )
      }else {
        return(
          <div>{staticView()}</div>
        )
      }
    }

    const deleteButton = () => {
      if(this.state.isOwner === true){
      return (
        <button id='editButton' onClick={this.delete} class='button is-small is-danger'>
        <span class="icon is-small">
        <i class="fas fa-trash-alt">
          </i>
          </span>
      </button>
      )
      }
    }


    const editButtons = () => {
      if(this.state.isOwner){ 
        return (
          <div id='editButtons'>
            <a id='editButton' className='button is-small is-primary' 
            href={`${user.username}/addProject`}>+ project</a>
            <a id='editButton' className='button is-small is-primary' 
            href={`${user.username}/addWaste`}>+ waste</a>
            <br></br>
            <button id='editButton' className='button is-small is-link' 
            onClick={this.editProfile}> edit </button>
            {deleteButton()}
          </div>
          )
      } else {
        return (
          <div id='editButtons'>
            <a id='editButton' className='button is-small is-link' 
            href='../../login'> login to edit </a>
          </div>

        )
      }
    }

    const checkDescription = () =>  {
      if(this.state.user.description){ 
        return (
          <div>
          <p> {user.description} </p>        
          </div>
          )
      } else {
        if(this.state.isOwner){
        return (
          <div>
          <p> <a onClick={this.editProfile} > Add a description </a> </p> 
          </div>
        )
      }}
    }

    const checkPhoto = () => {
      if(this.state.user.avatarURL){
        return (
          this.state.user.avatarURL
        )
      }else{
        return (
          this.state.url
        )
      }
    }

    const checkAddress = () =>  {
      if(this.state.user.location.address){ 
        return (
          <div>
          <p> {user.location.address} </p>        
          </div>
          )
      }
    }
    const checkContact = () =>  {
      // debugger
      if(this.state.user.phone){ 
        return (
          <div>
            <p>{user.email}</p>
            <p>{user.phone}</p>
          </div>
          )
      }else{
        return (
          <div>
            <p>{user.email}</p>
          </div>
          )
      }
    }

    const staticView = () => { 
      //console.log('staticView', user.avatarURL)
      return (
        <div id='staticView'>
          <div className='columns' id='userHeader'>
            <div className='column is-one-quarter' id='avatar'>
              <img src={checkPhoto()}></img>
            </div>
            <div className='column is-half' id='userInfo'>
                <h4 id='usernameTitle' class="title is-4">{user.username}</h4>

                <div id='userContactInfo'>
                  <div id='userAddress'>
                    {checkAddress()}
                  </div>  
                  <div id='userContact'>
                    {checkContact()}
                  </div>       
                </div>                 
          


                <div id='userDescription'>
                  {checkDescription()}
                </div>
            </div>
            <div className='column is-one-quarter' id='editButtons'>
              {editButtons()}
            </div>           
          </div>
        </div>
    )}

    const editView = () => { 
      return ( 
        <span>


          <div className='columns' >
            <div className='column is-half' id='userInfoUpdate'>
              <form method='POST' encType='multipart/form-data'>
                <label htmlFor='name'>
                  Username:
                  <input type='text' placeholder={this.state.user.name} onChange={this.setName} name='name' />
                </label>
                <label htmlFor='location'>
                  Location:
                  <input type='text' placeholder={this.state.user.location.address}  onChange={this.setLocation} name='location' />
                </label>
                <label htmlFor='email'>
                  E-mail:
                  <input type='text' placeholder={this.state.user.email}  onChange={this.setEmail} name='email' />
                </label>
                <label htmlFor='phone'>
                  Phone:
                  <input type='text' placeholder={this.state.user.phone}  onChange={this.setPhone} name='phone' />
                </label>
                <label htmlFor='description'>
                  Description:
                  <textarea rows="10" cols="19" placeholder={this.state.user.description}  onChange={this.setDescription} name='description' />
                </label>
                <label>
                  {indicatorText}
                  <div id='addPhotoInput'>
                    <input type='file' name='file' onChange={this.uploadPhoto} />
                  </div>
                </label>
                <div id='updateSubmitButtons' className='columns'>
                  <div className='column is-half' >
                      <a type='button' className='button is-primary' 
                      onClick={this.postProfile}> Update
                      </a>
                  </div>
                  <div id='editButton' className='column is-one-quarter'> 
                      <a type='button' className="button is-small is-danger is-outlined" 
                      onClick={this.stopEditing}> Cancel
                      </a>
                  </div>
                  <div id='editButton' className='column is-one-quarter' id='deleteButton'>
                    {deleteButton()}
                  </div>
                </div>
              </form>
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

    let user = this.state.user
    // //console.log(url)
      return ( 
        <div> {viewCheck()} </div>
      );
    }
  }


ReactDOM.render(<Profile />, document.getElementById('profile'));
