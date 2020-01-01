const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const config = require('./webpack.dev.config');

const options = {
  publicPath: config.output.publicPath,
  hot: true,
  // inline: true,
  historyApiFallback: true,
  // watchOptions: {
    // aggregateTimeout: 300,
    // poll: 1000,
  // },
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
    'Access-Control-Allow-Headers':
      'X-Requested-With, content-type, Authorization',
  },
};

WebpackDevServer.addDevServerEntrypoints(config, options);

new WebpackDevServer(webpack(config), options).listen(3000, '0.0.0.0', (err, result) => {
  if (err) {
    console.log(err);
  }

  console.log('Listening at 0.0.0.0:3000');
});
