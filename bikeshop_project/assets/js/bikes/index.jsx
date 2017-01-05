import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();


class App extends React.Component {
  render() {
    return (
      <div className="mdl-grid">
          <div className="mdl-cell mdl-cell--12-col">
              <h1>Bikes</h1>
          </div>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
