var path = require("path")
var webpack = require('webpack')
var BundleTracker = require('webpack-bundle-tracker')

const autoprefixer = require('autoprefixer');

module.exports = {
    context: __dirname,

    entry: './assets/js/index',

    output: {
        path: path.resolve('./assets/bundles/'),
        filename: "[name]-[hash].js"
    },

    plugins: [
        
    ], // add all common plugins here

    module: {
        loaders: [
            
        ]
    },

    resolve: {
        modulesDirectories: [
            'node_modules',
            'bower_components'
        ],
        extensions: ['', '.js', '.jsx', '.scss']
    },
    postcss: [autoprefixer]
}