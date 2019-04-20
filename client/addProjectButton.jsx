class AddProjectButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      path: window.location.pathname
    }
  }

  render() {
    const user = this.state.path.replace('/catalog/user/profile/', '')

    return (
      <button><a href={`${user}/addProject`}>Add Project</a></button>
    );
  }
}


const domContainer = document.querySelector('#addProjectButton');

ReactDOM.render(< AddProjectButton />, domContainer);
