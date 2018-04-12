var path = require('path');
var webpack = require('webpack');
var fs = require('fs');
var node_modules_dir = path.resolve(__dirname, 'node_modules');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var dotenv = require('dotenv');

function generateConfig(indexPath, brand, envVars) {
	return {
		entry: {
			base: indexPath,
			vendors: [
				'react',
				'react-bootstrap',
				'react-dom',
				'react-router',
				'redux',
				'react-redux',
				'react-router-redux',
				'es6-promise',
				'react-ga',
				'js-cookie',
				'bootstrap', // TODO: Remove with SPA
				'jquery', // TODO: Remove with SPA
				'moment',
			],
		},
		output: {
			path: path.resolve(__dirname, 'public/dist/'),
			filename: brand + '.bundle.js',
		},
		plugins: [
			new webpack.DefinePlugin({
				'process.env': Object.keys(envVars).reduce(function(o, k) {
					// Whitelist to variables only prefixed with CLIENT_
					if (k.indexOf('CLIENT_') === 0) {
						o[k] = JSON.stringify(envVars[k]);
					}
					return o;
				}, {}),
			}),
			new webpack.DefinePlugin({
				'process.env.NODE_ENV': '"production"',
			}),
			new webpack.ProvidePlugin({
				$: 'jquery',
				jQuery: 'jquery',
			}),
			new webpack.optimize.UglifyJsPlugin(),
			new ExtractTextPlugin(brand + '.styles.css'),
			new webpack.optimize.CommonsChunkPlugin({
				name: 'vendors',
				filename: brand + '.vendors.js',
			}),
		],
		module: {
			rules: [
				{
					test: /\.jsx{0,1}$/,
					loader: 'babel-loader',
					exclude: node_modules_dir,
					options: {
						presets: ['es2015', 'react'],
						plugins: [
							require('babel-plugin-transform-object-rest-spread'),
							require('babel-plugin-transform-object-assign'),
						],
					},
				},
				{
					test: /\.less$/,
					loader: ExtractTextPlugin.extract([
						'css-loader',
						'less-loader',
					]),
				},
				{
					test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
					loader: 'url-loader',
					options: {
						limit: 10000,
						mimetype: 'application/font-woff',
					},
				},
				{
					test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
					loader: 'url-loader',
					options: {
						limit: 10000,
						mimetype: 'application/octet-stream',
					},
				},
				{
					test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
					loader: 'file-loader',
				},
				{
					test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
					loader: 'url-loader',
					options: {
						limit: 10000,
						mimetype: 'image/svg+xml',
					},
				},
			],
		},
		resolve: {
			extensions: ['.js', '.jsx'],
		},
	};
}

function readEnvironmentVariables(filename) {
	return dotenv.parse(fs.readFileSync(filename));
}

function initConfig(_indexPath) {
	var envVars = {};
	var regPath;

	if (_indexPath) {
		regPath = path.resolve(__dirname, _indexPath);
	} else if (process.argv.indexOf('--env.register') >= 0) {
		regPath = path.resolve(
			__dirname,
			`./registers/${
				process.argv[process.argv.indexOf('--env.register') + 1]
			}`
		);
	} else {
		regPath = path.resolve(
			__dirname,
			process.argv.indexOf('--env.regPath') >= 0
				? process.argv[process.argv.indexOf('--env.regPath') + 1]
				: '.'
		);
	}
	try {
		fs.accessSync(path.resolve(regPath, '.env'), fs.F_OK);
		envVars = readEnvironmentVariables(path.resolve(regPath, '.env'));
	} catch (e) {
		console.log(
			'Missing .env file in ' +
				regPath +
				' or unable to parse .env file...'
		);
		process.exit();
	}

	// Should result in the same value as 'brand safe' in keystone
	var brandSafe = (envVars.BRAND || 'app')
		.trim()
		.replace(/\W+/g, '-')
		.toLowerCase();

	var indexPath = path.resolve(regPath, 'index.jsx');

	// Check for a local index.jsx file
	try {
		fs.accessSync(indexPath, fs.F_OK);
	} catch (e) {
		// Default to the root index.jsx file
		indexPath = path.resolve(__dirname, 'client/scripts/index.jsx');
	}

	return generateConfig(indexPath, brandSafe, envVars);
}

module.exports = initConfig();
