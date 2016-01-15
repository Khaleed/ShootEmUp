var webpack = require('webpack');
var path = require('path');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
    // console erros map to correct file and line number
    devtool: 'source-map',

    entry: {
        // hot style updates
        'webpack/hot/dev-server',
        // refresh on none hot style updates
        'webpack-dev-server/client?http://localhost:8080',
        // current app
        path.resolve(__dirname, 'app', 'game.js')
    },

    devServer: {
        contentBase: "public/"
    },

    output: {
        path: path.resolve(__dirname, 'public'),
        publicPath: '/'
        filename: 'bundle.js'
    },

    // define module loaders
    module: {
        loaders: [
            // ES6 loader
            {
                test: /\.jsx?$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel?optional[]=runtime'
            },
            // JSON loader
            {
                test: /\.json$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'json'
            },
            // CSS Loader
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract("style-loader", "css-loader")
            },
        ]
    },

    resolve: {
        extensions: ['.js', '.json', '']
    },

    plugins: [
        // Extract CSS files
        new ExtractTextPlugin("style.css"),
        // Hot module replacement
        new webpack.HotModuleReplacementPlugin()
    ]
};