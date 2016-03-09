var webpack = require('webpack');
var path = require('path');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
    // console errors map to correct file and line number
    devtool: 'source-map',
    // app entry point
    entry: [
        // hot style updates
        'webpack/hot/dev-server',

        // refresh browser on none hot updates
        'webpack-dev-server/client?http://localhost:8080',

        // current app
        path.resolve(__dirname, 'app', 'game.js')
    ],

    devServer: {
        contentBase: "public/"
    },

    output: {
        path: __dirname,
        publicPath: '/',
        filename: 'bundle.js'
    },

    // define module loaders
    module: {
        loaders: [
            // ES6 loader
            {
                test: /\.jsx?$/, // match loader to file
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
                // load css file into it's own file
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
        // Avoid duplicated stuff
        new webpack.optimize.DedupePlugin(),
        // Optimise occurence order
        new webpack.optimize.OccurenceOrderPlugin(),
        // only for production  
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('production')
            }
        }),
        // minimise output chunks of scripts/css
        new webpack.optimize.UglifyJsPlugin({
            compressor: {
                warnings: false
            }
        })
    ]
};
