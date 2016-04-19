var path = require('path');
var webpack = require('webpack');
var node_modules_dir = path.resolve(__dirname, 'node_modules');


require('dotenv').load();

module.exports = {
    devtool: 'cheap-module-eval-source-map',
    entry: [
        'webpack-hot-middleware/client',
        path.resolve(__dirname, 'client/scripts/index.jsx')
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
                if (k.indexOf('CLIENT_') === 0 || k === 'NODE_ENV') {
                    o[k] = JSON.stringify(process.env[k]);
                }
                return o;
            }, {})
        }),
		new webpack.ProvidePlugin({
			$: "jquery",
			jQuery: "jquery"
		})
    ],
    module: {
        loaders: [
            {
                test: /\.jsx{0,1}$/,
                loader: 'babel-loader',
                exclude: node_modules_dir,
                include: path.join(__dirname, '/client/'),
                query: {
                    'presets': ['es2015', 'react'],
					'plugins': ['transform-object-rest-spread', 'transform-object-assign'],
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
                }
            }, {
                test: /\.less$/,
                loader: "style!css!less"
            }, {
				test: /\.css$/,
				loader: 'style!css'
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
