class Image extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
          img: 'data:image/jpeg;base64,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'
      };
  };
  
  async componentDidMount() {
      console.log('doing stuff')
      await axios.get('avatarJSON')
      console.log('posted')
      const photo = this.getSomeAsyncData('avatarJSON')
      if (photo) {
        console.log(photo)
      }
    }
    
    arrayBufferToBase64(buffer) {
      var binary = '';
      var bytes = [].slice.call(new Uint8Array(buffer));
      bytes.forEach((b) => binary += String.fromCharCode(b));
      return window.btoa(binary);
    };
    
    fetchTheData(someValue) {
      return new Promise((resolve, reject) => {
        this.getData(someValue, (result) => {
          resolve(result);
        })
      });
    }
    

    getSomeAsyncData(value) {
      const result = this.fetchTheData(value);
      return result;
    }
    
    getData(path, callback) {
      console.log('getting data')
    
      fetch(path, { credentials: 'include' })
        .then((res) => res.json())
        .then((res) => {
          if(res.ok){
          const base64Flag = 'data:image/jpeg;base64,';
          const photoBuffer = res.photo
          console.log(photoBuffer)
          const base64 = this.arrayBufferToBase64(photoBuffer)
          const photo = base64Flag + base64
          
          if (res.photo.length > 0){
          this.setState({
            img: photo
          })} else {
            console.log('no avatar found')
          }

          callback('done')
        } else {
          throw Error(`Request rejected with status ${res.status}`);
        }

        })
    }
  

  render() {
      const {img} = this.state;
      return (
        <span>
          <div>
          <img
              src={img}
              alt='Avatar'/>
              </div>
              </span>
      )
  }

}

ReactDOM.render(<Image />, document.getElementById('avatar'));
