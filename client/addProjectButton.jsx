class AddProjectButton extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <button><a href='addProject'>Add Project</a></button>
    );
  }
}


const domContainer = document.querySelector('#addProjectButton');

ReactDOM.render(< AddProjectButton />, domContainer);
