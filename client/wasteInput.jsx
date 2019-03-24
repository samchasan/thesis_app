import axios from 'axios';
import { assertTSPropertySignature } from 'babel-types';
import FormData from 'form-data'

class WasteInput extends React.Component {
  constructor(props) {
    super(props)
    this.makeWaste = this.makeWaste.bind(this);

    this.state = {
      loading: false,
    };
  }

  async makeWaste(event) {
    this.setState({
      loading:true
    });

    const file = event.target.files[0];

    if (file) {
      const formData = new FormData();
      formData.append('file', file);

      await axios.post('makeWaste', formData, {
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
          <form action='postWaste' method='POST' encType='multipart/form-data'>
          <div>
          <input type='file'
            name='file'
            onChange={this.makeWaste} />
            </div>
            <button type='submit' className='addBtn'>Submit</button>
            </form>
            </div>

        </span>
      );
    }
  }


ReactDOM.render(<WasteInput />, document.getElementById('wasteInput'));
