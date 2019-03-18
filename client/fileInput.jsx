import axios from 'axios';
import { assertTSPropertySignature } from 'babel-types';
import FormData from 'form-data'
let data = new FormData();

class FileInput extends React.Component {
  constructor(props) {
    super(props)
    this.uploadFile = this.uploadFile.bind(this);

    this.state = {
      loading: false,
      // value: ''
    };
  }

  async uploadFile(event) {
    this.setState({
      loading:true
    });

    const file = event.target.files[0];

    if (file) {
      // console.log(file)
      cloudinary.openUploadWidget({ cloud_name: 'dra7vrduw', upload_preset: 'PRESET', tags:['xmas']},
            function(error, result) {
                console.log(result);
                this.setState({
                  loading: false,
                  uploaded: true,
                  // value: {file}
                });
            });
    
      
      
    }
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
      return ( 
        <span>
            <div>
              {indicatorText}
          <form action='/catalog/user/avatar' method='POST' encType='multipart/form-data'>
          <div>
          <input type='file'
            name='file'
            class='cloudinary-fileupload'
            data-form-data={ 'upload_preset: "user_upload1", 
            'callback': "https://www.example.com/cloudinary_cors.html"}
            onChange={this.uploadFile} />
            </div>
            <button type='submit' className='btn'>Submit</button>
            </form>
            </div>

        </span>
      );
    }
  }


ReactDOM.render(<FileInput />, document.getElementById('fileInput'));
