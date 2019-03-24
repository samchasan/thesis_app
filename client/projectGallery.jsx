class Gallery extends React.Component {
  constructor(props) {
      super(props);
      this.projectURLs = []
      this.state = {
          img: ''
      };
      
  };

  renderImage(imageUrl) {
    return (
      <div>
        <img src={imageUrl} />
      </div>
    );
  }
  
  componentDidMount() {
      console.log('doing stuff')
      const photo = this.getSomeAsyncData('projectJSON')
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
          const L = res.photo.length
          for (const i = 0; i < L; i ++ ){
          const base64Flag = 'data:image/jpeg;base64,';
          const photoBuffer = res.photo[i].img.data.data
          const base64 = this.arrayBufferToBase64(photoBuffer)
          const photo = base64Flag + base64
          this.projectURLs.push(photo)
          // this.setState({
          //   img: photo
          // })
        }
          callback('done')

        })
    }
  

  render() {
      return (
        <div className="gallery">
        <div className="images">
          {this.props.imageUrls.map(imageUrl => this.renderImage(imageUrl))}
        </div>
      </div>
      )
  }

}

ReactDOM.render(<Gallery imageUrls={this.imageUrls} />, document.getElementById('projectGallery'));
