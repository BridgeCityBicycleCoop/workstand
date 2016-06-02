import React from 'react';
import ReactDOM from 'react-dom';
import Autocomplete from 'react-toolbox/lib/autocomplete';

const source = {
  'ES-es': 'Spain',
  'TH-th': 'Thailand',
  'EN-gb': 'England',
  'EN-en': 'USA'
};

class AutocompleteTest extends React.Component {
  state = {
    countries: ['ES-es', 'TH-th']
  };

  handleChange = (value) => {
    this.setState({countries: value});
  };

  render () {
    return (
      <Autocomplete
        direction="down"
        selectedPosition="above"
        label="Choose countries"
        onChange={this.handleChange}
        source={source}
        value={this.state.countries}
      />
    );
  }
}

class App extends React.Component {
    render () {
        return (<AutocompleteTest />)
    }
}

ReactDOM.render(<App />, document.getElementById('root'));
