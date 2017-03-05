import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import injectTapEventPlugin from 'react-tap-event-plugin';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { reducer as formReducer } from 'redux-form';
import bikesReducer from './reducers';
import createSagaMiddleware from 'redux-saga'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import BikeTable from './components/BikeTable';
import watchFetchBikes from './sagas';


// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

const reducers = {
  // ... your other reducers here ...
  form: formReducer,     // <---- Mounted at 'form'
  bikes: bikesReducer,
};

const sagaMiddleware = createSagaMiddleware();

const combinedReducers = combineReducers(reducers);

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(combinedReducers, composeEnhancers(applyMiddleware(sagaMiddleware)));

sagaMiddleware.run(watchFetchBikes);


class App extends React.Component {
  render() {
    return (
      <MuiThemeProvider muiTheme={getMuiTheme()}>
        <BikeTable />
      </MuiThemeProvider>
    );
  }
}

ReactDOM.render(<Provider store={store}><App /></Provider>, document.getElementById('root'));
