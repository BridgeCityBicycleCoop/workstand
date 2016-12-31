var path = require("path")
var webpack = require('webpack')
var BundleTracker = require('webpack-bundle-tracker')
const ExtractTextPlugin = require('extract-text-webpack-plugin');

var config = require('./webpack.base.config.js')

// Use webpack dev server
config.entry = [
    'webpack-dev-server/client?http://webpack.docker:3000',
    'webpack/hot/only-dev-server',
    './assets/js/index'
]

// override django's STATIC_URL for webpack bundles
config.output.publicPath = 'http://webpack.docker:3000/assets/bundles/'

// Add HotModuleReplacementPlugin and BundleTracker plugins
config.plugins = config.plugins.concat([
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new BundleTracker({filename: './webpack-stats.json'}),
    new ExtractTextPlugin('react-toolbox.css', {allChunks: true}),
])

// Add a loader for JSX files with react-hot enabled
config.module.loaders.push(
    {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loaders: ['react-hot','babel-loader']

    },
    {
        test: /(\.scss|\.css)$/,
        loader: ExtractTextPlugin.extract('style', 'css?sourceMap&modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!postcss!sass?sourceMap!toolbox')
    }
)

module.exports = config