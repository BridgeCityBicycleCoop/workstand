import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AutoComplete from 'material-ui/AutoComplete';
import { polyFill } from 'es6-promise';
import fetch from 'isomorphic-fetch';

class MemberAutoComplete extends React.Component {

    constructor (props) {
    super(props);
    this.state = {members: [], error: '' };
    this.handleUpdate = this.handleUpdate.bind(this);
    this.signIn = this.signIn.bind(this);
    // this.filter = this.filter.bind(this);
  }

    handleUpdate (text, dataSource) {
        let self = this;
        fetch(`//bikeshop.local/member/search/${text}/`)
            .then((response) => {
                if (response.status === 200)
                    return response.json();
            })
            .then((data) => {
                console.log(data.results);
                if (data.results.length > 0) {
                    self.setState({
                        error: '',
                        members: data.results.map((result) => {
                            return {text: `${result.name}`, value: `${result.name} <${result.email}>`, id: result.id}
                        })
                    });
                } else {
                    self.setState({error: 'Member not found.'})
                }
                // self.setState({members: data.results})
            })
    }

    handleFilter (searchText, key) {
        console.log(searchText);
        console.log(key);
    }

    signIn (chosenRequest, idx) {
        console.log(chosenRequest)
        console.log(this.state.members[idx])
    }

    render () {
        return <AutoComplete
            dataSource={this.state.members}
            onUpdateInput={this.handleUpdate}
            openOnFocus={true}
            filter={AutoComplete.noFilter}
            onNewRequest={this.signIn}
            errorText={this.state.error}
        />
    }
}


class App extends React.Component {
    render () {
        return (
            <MuiThemeProvider muiTheme={getMuiTheme()}>
                <MemberAutoComplete />
            </MuiThemeProvider>
        )
    }
}

ReactDOM.render(<App />, document.getElementById('root'));
