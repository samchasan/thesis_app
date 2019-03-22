import axios from 'axios'

const e = React.createElement;

class Container extends React.Component {
  
  constructor(props) {
    super(props)
    this.getImgData = this.getImgData.bind(this);

  
  }

  async getImgData(){
    const path '/avatarJSON'
    const jSON = $.getJSON(path, function(data) {
    const avatar = data 
   }
  }
  
  



  render() {
    return (
      <a href='https://xkcd.com/221/'>
        <img src='https://imgs.xkcd.com/comics/random_number.png' />
      </a>
      
    );
  }

}

const domContainer = document.getElementById('avatar')
ReactDOM.render(e(Container), domContainer);
