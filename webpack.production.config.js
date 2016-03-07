var path = require('path');
var webpack = require('webpack');
var node_modules_dir = path.resolve(__dirname, 'node_modules');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var glob = require('glob');

require('dotenv').load();

var jsEntry = {
	app: path.resolve(__dirname, 'client/scripts/index.jsx'),
	vendors: ['react', 'jquery', 'react-bootstrap', 'react-dom', 'redux', 'masonry-layout', 'imagesloaded']
};

function findRegisters() {
	var registerStyles = jsEntry;
	glob.sync('registers/*/override/styles/site.less').forEach(function (stylePath) {
		var match = /^registers\/([^\/]+)\//.exec(stylePath);
		if (match) {
			registerStyles[match[1]] = path.resolve(__dirname, stylePath);
	}
	});
	return registerStyles;
}


module.exports = {
    entry: findRegisters(),
    output: {
        path: path.resolve(__dirname, 'public/dist/'),
        filename: '[name].bundle.js'
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
		new webpack.DefinePlugin({
			'process.env.NODE_ENV': '"production"'
		}),
		new webpack.ProvidePlugin({
			$: "jquery",
			jQuery: "jquery"
		}),
		new ExtractTextPlugin('[name].styles.css'),
        new webpack.optimize.CommonsChunkPlugin('vendors', 'vendors.js')
    ],
    module: {
        loaders: [{
            test: /\.jsx{0,1}$/,
            loader: 'babel-loader',
            exclude: [node_modules_dir],
            query: {
                presets: ['es2015', 'react'],
				plugins: ['transform-object-rest-spread']
            }
		}, {
				test: /\.less$/,
				loader: ExtractTextPlugin.extract(['css', 'less'])
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
			}]
    },
    resolve: {
        extensions: ['', '.js', '.jsx']
    }
};
