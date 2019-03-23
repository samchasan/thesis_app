class Image extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
          img: ''
      };
  };
  
  componentDidMount() {
      console.log('doing stuff')
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
    
      fetch(path)
        .then((res) => res.json())
        .then((res) => {
          const base64Flag = 'data:image/jpeg;base64,';
          const photoBuffer = res.photo[0].img.data.data
          const base64 = this.arrayBufferToBase64(photoBuffer)
          const photo = base64Flag + base64
          
          this.setState({
            img: photo
          })

          callback('done')

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
