const webpack = require('webpack');
const BundleTracker = require('webpack-bundle-tracker');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const config = require('./webpack.base.config.js');

config.output.path = require('path').resolve('./assets/dist');

config.plugins = config.plugins.concat([
  new BundleTracker({ filename: './webpack-stats-prod.json' }),
  new ExtractTextPlugin('react-toolbox.css', { allChunks: true }),

  // removes a lot of debugging code in React
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify('production'),
    },
  }),

  // keeps hashes consistent between compilations
  new webpack.optimize.OccurenceOrderPlugin(),

  // minifies your code
  new webpack.optimize.UglifyJsPlugin({
    compressor: {
      warnings: false,
    },
  }),
]);

// Add a loader for JSX files
config.module.loaders.push(
  // { test: /\.jsx?$/, exclude: /node_modules/, loader: 'babel' },
  // {
  //   test: /(\.scss|\.css)$/,
  //   loader: ExtractTextPlugin.extract(
  //     'style',
  //     'css?sourceMap&modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!postcss!sass?sourceMap!toolbox'
  //   ),
  // }
);

module.exports = config;
