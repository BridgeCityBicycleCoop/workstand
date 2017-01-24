const path = require('path');
const webpack = require('webpack');
const BundleTracker = require('webpack-bundle-tracker');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const autoprefixer = require('autoprefixer');

module.exports = {
  context: __dirname,
  devtool: 'inline-source-map',
  entry: {
    signin: './assets/js/index',
    members: './assets/js/members/index',
  },
  output: {
    path: path.resolve('./assets/bundles/'),
    filename: '[name]-[hash].js',
  },

  plugins: [
    new BundleTracker({ filename: './webpack-stats.json' }),
    new ExtractTextPlugin('react-toolbox.css', { allChunks: true }),
    new webpack.NoErrorsPlugin(),
  ],

  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015', 'stage-0', 'react'],
        },
      },
      {
        test: /(\.scss|\.css)$/,
        loader: ExtractTextPlugin.extract('style', 'css?sourceMap&modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!postcss!sass?sourceMap!toolbox'),
      },
    ],
  },
  resolve: {
    modulesDirectories: [
      'node_modules',
      'bower_components',
      path.resolve(__dirname, './node_modules'),
    ],
    extensions: ['', '.js', '.jsx', '.scss'],
  },
  postcss: [autoprefixer],
};
