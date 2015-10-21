var path = require('path')

module.exports = {
    devtool: 'source-map',
    entry: {
        app: ['./app/game.js']
    },
    devServer: {
        contentBase: "public/"
    },
    output: {
        path: path.resolve(__dirname, 'public'),
        publicPath: '/',
        filename: 'bundle.js'
    },
    module: {
        loaders: [
            // Babel loader
            {
                test: /\.jsx?$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel?optional[]=runtime'
            },

            {
                test: /\.json$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'json'
            }
        ]
    },
    resolve: {
        extensions: ['.js', '.json', '']
    }
}