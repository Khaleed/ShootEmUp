var webpack = require('webpack');
var path = require('path');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
    // console errors map to correct file and line number
    devtool: 'eval-source-map',
    // app entry point
    entry: [
        // refresh browser on none HMR updates
        'webpack-dev-server/client?http://localhost:8080',
        // save code -> gets injected into page without refresh
        'webpack/hot/dev-server',
        // current app
        path.resolve(__dirname, 'app', 'game.js')
    ],

    devServer: {
        // where to serve files from
        contentBase: "public/",
        hot: true
    },

    output: {
        path: path.resolve(__dirname, 'public'),
        publicPath: '/',
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
                // load css files
                loader: ExtractTextPlugin.extract("style-loader", "css-loader")
            },
        ]
    },
    // resolution
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
