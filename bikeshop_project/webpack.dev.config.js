const webpack = require('webpack');
const BundleTracker = require('webpack-bundle-tracker');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const config = require('./webpack.base.config.js');

// Use webpack dev server
config.entry = {
  webpack: [
    'webpack-dev-server/client?http://192.168.99.100:3000',
    'webpack/hot/only-dev-server',
  ],
  signin: './assets/js/index',
  members: './assets/js/members/index',
  bikes: './assets/js/bikes/index',
};

// override django's STATIC_URL for webpack bundles
config.output.publicPath = 'http://192.168.99.100:3000/assets/bundles/';

config.devtool = 'eval-source-map';

// Add HotModuleReplacementPlugin and BundleTracker plugins
config.plugins = config.plugins.concat([
  new webpack.HotModuleReplacementPlugin(),
  new webpack.NoErrorsPlugin(),
  new BundleTracker({ filename: './webpack-stats.json' }),
  new ExtractTextPlugin('react-toolbox.css', { allChunks: true }),
]);

// Add a loader for JSX files
config.module.loaders.push(
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
    loader: ExtractTextPlugin.extract('style', 'css?sourceMap&modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!postcss!sass?sourceMap!toolbox'),
  },
  {
    test: /\.json$/,
    loader: 'json-loader',
  }
);

module.exports = config;
