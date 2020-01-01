import React from 'react';
import ReactDOM from 'react-dom';
import App from './app';

const mountNode = document.getElementById('root');

ReactDOM.render(<App />, mountNode);

// Webpack Hot Module Replacement API
// module.hot.accept('./app', () => render(App));
