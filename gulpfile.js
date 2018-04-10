var gulp = require('gulp');
var webpack = require('webpack');
var webpackConf = require('./webpack.production.config');
var path = require('path');
var glob = require('glob');

// Finds all instances of .env-files in register folders
var registers = glob.sync('./registers/*/.env').map(function(stylePath) {
	var regPath = path.resolve(stylePath, '..').replace(__dirname, '.');
	var name = regPath.replace('.\\registers\\', '');
	return {
		path: regPath,
		name: name,
	};
});

// Add root folder as well
registers.push({ regPath: null, name: 'root' });

registers.forEach(function(el) {
	gulp.task('build-register-' + el.name, function(done) {
		webpack(webpackConf.initConfig(el.path), function(err, stats) {
			if (err) {
				console.log(err);
			}
			done();
		});
	});
});

gulp.task(
	'build-all',
	registers.map(function(el) {
		return 'build-register-' + el.name;
	})
);
