class AddWasteButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      path: window.location.pathname
    }
  }

  render() {
    const user = this.state.path.replace('/catalog/user/profile/', '')

    return (
      <button><a href={`${user}/addWaste`}>Add Waste</a></button>
    );
  }
}


const domContainer = document.querySelector('#addWasteButton');

ReactDOM.render(< AddWasteButton />, domContainer);
