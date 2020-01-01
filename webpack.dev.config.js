const webpack = require('webpack');
const BundleTracker = require('webpack-bundle-tracker');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const config = require('./webpack.base.config.js');

// Use webpack dev server
config.entry.webpack = [
    'webpack-dev-server/client?http://localhost:3000',
    'webpack/hot/only-dev-server',
];

// override django's STATIC_URL for webpack bundles
config.output.publicPath = 'http://localhost:3000/assets/bundles/';

config.devtool = 'inline-source-map';

// Add HotModuleReplacementPlugin and BundleTracker plugins
config.plugins = config.plugins.concat([
  new BundleTracker({ filename: 'webpack-stats.json' }),
  new webpack.HotModuleReplacementPlugin(),
]);

config.mode = 'development';

module.exports = config;
