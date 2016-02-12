var path = require('path');
var webpack = require('webpack');
var node_modules_dir = path.resolve(__dirname, 'node_modules');

require('dotenv').load();

module.exports = {
    entry: {
        app: path.resolve(__dirname, 'client/scripts/index.jsx'),
        vendors: ['react', 'jquery', 'moment', 'react-bootstrap']
    },
    output: {
        path: path.resolve(__dirname, 'public/js/dist'),
        filename: 'bundle.js'
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': Object.keys(process.env).reduce(function (o, k) {
                //Whitelist to variables only prefixed with CLIENT_
                if (k.indexOf('CLIENT_') === 0) {
                    o[k] = JSON.stringify(process.env[k]);
                }
                return o;
            }, {})
        }),
        new webpack.optimize.CommonsChunkPlugin('vendors', 'vendors.js')
    ],
    module: {
        loaders: [{
            test: /\.jsx{0,1}$/,
            loader: 'babel-loader',
            exclude: [node_modules_dir],
            query: {
                presets: ['es2015', 'react']
            }
        }]
    },
    resolve: {
        extensions: ['', '.js', '.jsx']
    }
};
