import axios from 'axios'

const e = React.createElement;

class Container extends React.Component {
  // constructor(props) {
  //   super(props);
  //   this.inputRef = React.createRef();
  //
  // }

  showOpenFileDlg = (event) => {
    console.log(event)
  }


  render() {
    return (
      // <div id='avatarContent'>
      <a href='https://xkcd.com/221/'>
        <img src='https://imgs.xkcd.com/comics/random_number.png' />
      </a>
      // <input id='avatarInput' type="file" onChange={this.showOpenFileDlg} />
      // <div id='avatarWrapper'>
      // </div>
      // </div>
    );
  }
}





const domContainer = document.getElementById('avatar')
ReactDOM.render(e(Container), domContainer);
