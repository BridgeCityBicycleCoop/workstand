import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import MemberTable from './components/MemberTable';

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();


const App = () => (
  <MuiThemeProvider muiTheme={getMuiTheme()}>
    <div>
      <h1>Members</h1>
      <MemberTable />
    </div>
  </MuiThemeProvider>
);

ReactDOM.render(<App />, document.getElementById('root'));
