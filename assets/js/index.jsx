import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import SignIn from './components/SignIn';



class App extends React.Component {
    render () {
        return (
            <MuiThemeProvider muiTheme={getMuiTheme()}>
                <SignIn />
            </MuiThemeProvider>
        )
    }
}

ReactDOM.render(<App />, document.getElementById('root'));
