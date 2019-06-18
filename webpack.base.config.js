const path = require('path');
const autoprefixer = require('autoprefixer');
require('babel-polyfill');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  context: __dirname,

  entry: {
    signin: './assets/js/index',
    members: './assets/js/members/index',
    bikes: './assets/js/bikes/index',
    babelPolyfill: 'babel-polyfill',
  },

  output: {
    path: path.resolve('./assets/bundles/'),
    filename: '[name]-[hash].js',
  },

  plugins: [
      new ExtractTextPlugin('react-toolbox.css', { allChunks: true }),
  ], // add all common plugins here

  module: {
    loaders: [
      {
        test: /\.json$/,
        loader: 'json-loader',
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['latest', 'react', 'stage-3'],
          plugins: ['transform-runtime'],
        },
      },
      {
        test: /(\.scss|\.css)$/,
        loader: ExtractTextPlugin.extract('style', 'css?sourceMap&modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!postcss!sass?sourceMap!toolbox')
      }
    ],
  },

  resolve: {
    modulesDirectories: [
      'node_modules',
      'bower_components',
    ],
    extensions: ['', '.js', '.jsx', '.scss'],
  },
  postcss: [autoprefixer],
};
