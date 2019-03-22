import axios from 'axios';
import { assertTSPropertySignature } from 'babel-types';
import FormData from 'form-data'

class FileInput extends React.Component {
  constructor(props) {
    super(props)
    this.makeAvatar = this.makeAvatar.bind(this);

    this.state = {
      loading: false,
    };
  }

  async makeAvatar(event) {
    this.setState({
      loading:true
    });

    const file = event.target.files[0];

    if (file) {
      const formData = new FormData();
      formData.append('file', file);

      await axios.post('makeAvatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      this.setState({
        loading: false,
        uploaded: true
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
          <form action='/catalog/user/postAvatar' method='POST' encType='multipart/form-data'>
          <div>
          <input type='file'
            name='file'
            onChange={this.makeAvatar} />
            </div>
            <button type='submit' className='addBtn'>Submit</button>
            </form>
            </div>

        </span>
      );
    }
  }


ReactDOM.render(<FileInput />, document.getElementById('fileInput'));
