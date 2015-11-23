var path = require('path');
var webpack = require('webpack');

require('dotenv').load();

module.exports = {
	devtool: 'cheap-module-eval-source-map',
	entry: [
		'webpack-hot-middleware/client',
		'./client/scripts/index'
	],
	output: {
		path: path.join(__dirname, 'dist'),
		filename: 'bundle.js',
		publicPath: '/js/'
	},
	plugins: [
		new webpack.optimize.OccurenceOrderPlugin(),
		new webpack.HotModuleReplacementPlugin(),
		new webpack.NoErrorsPlugin(),
		new webpack.DefinePlugin({
			'process.env': Object.keys(process.env).reduce(function(o, k) {
				//Whitelist to variables only prefixed with CLIENT_
				if (k.indexOf('CLIENT_') === 0) {
					o[k] = JSON.stringify(process.env[k]);
				}
				return o;
			}, {})
		})
	],
	module: {
		loaders: [{
			test: /\.js$/,
			loader: 'babel',
			query: {
				'stage': 2,
				'env': {
					'development': {
						'plugins': [
							'react-transform'
						],
						'extra': {
							'react-transform': {
								'transforms': [{
									'transform': 'react-transform-hmr',
									'imports': ['react'],
									'locals': ['module']
								}]
							}
						}
					}
				}
			},
			exclude: /node_modules/,
			include: path.join(__dirname, '/client/')
		}]
	}
};
