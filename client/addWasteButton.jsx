class AddWasteButton extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <button><a href='addWaste'>Add Waste</a></button>
    );
  }
}


const domContainer = document.querySelector('#addWasteButton');

ReactDOM.render(< AddWasteButton />, domContainer);
