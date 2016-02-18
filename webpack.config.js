var path = require('path');
var webpack = require('webpack');

require('dotenv').load();

module.exports = {
    devtool: 'cheap-module-eval-source-map',
    entry: [
        'webpack-hot-middleware/client',
        './client/scripts/index.jsx'
    ],
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'bundle.js',
        publicPath: '/js/'
    },
    plugins: [
        // Hot Middleware 
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin(),
        // process.env replacement
        new webpack.DefinePlugin({
            'process.env': Object.keys(process.env).reduce(function (o, k) {
                //Whitelist to variables only prefixed with CLIENT_
                if (k.indexOf('CLIENT_') === 0) {
                    o[k] = JSON.stringify(process.env[k]);
                }
                return o;
            }, {})
        })
    ],
    module: {
        loaders: [
            {
                test: /\.jsx{0,1}$/,
                loader: 'babel-loader',
                query: {
                    'presets': ['es2015', 'react'],
                    'env': {
                        'development': {
                            'plugins': [['react-transform', {
                                'transforms': [{
                                    'transform': 'react-transform-hmr',
                                    'imports': ['react'],
                                    'locals': ['module']
                                }]
                            }]
                            ]
                        }
                    }
                },
                exclude: /node_modules/,
                include: path.join(__dirname, '/client/')
            }, {
                test: /\.less$/,
                loader: "style!css?-url!less"
            }, {
				test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
				loader: 'url?limit=10000&mimetype=application/font-woff'
			}, {
				test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
				loader: 'url?limit=10000&mimetype=application/octet-stream'
			}, {
				test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
				loader: 'file'
			}, {
				test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
				loader: 'url?limit=10000&mimetype=image/svg+xml'
			}
        ]
    },
    resolve: {
        extensions: ['', '.js', '.jsx']
    }
};
