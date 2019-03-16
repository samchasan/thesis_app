'use strict'

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


  render(){
    return React.createElement(
          'div', { id: 'avatarWrapper' },
            'input', {type:"file", onChange: this.showOpenFileDlg}
        )
  }

}


class Avatar extends React.Component {
 render() {
   return React.createElement(
          'div', { id: 'avatarWrapper' },
          React.createElement('a', { href: 'https://xkcd.com/221/' },
          React.createElement('img', {
      src: 'https://imgs.xkcd.com/comics/random_number.png'
      })
    ),
  );
 }
}



const domContainer = document.getElementById('avatar')
ReactDOM.render(e(Container), domContainer);
