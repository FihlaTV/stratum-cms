var gulp = require('gulp'),
	eslint = require('gulp-eslint'),
	watch = require('gulp-watch'),
	inquirer = require('inquirer'),
	webpack = require('webpack'),
	webpackConf = require('./webpack.production.config'),
	merge = require('merge-stream'),
	path = require('path'),
	glob = require('glob');

/*
 * Create variables for our project paths so we can change in one place
 */
var paths = {
	'src': ['./models/**/*.js', './routes/**/*.js', 'keystone.js']
};

// Finds all instances of .env-files in register folders
var registers = glob.sync('./registers/*/.env').map(function (stylePath) {
	var regPath = path.resolve(stylePath, '..').replace(__dirname, '.');
	var name = regPath.replace('.\\registers\\', '');
	return {
		path: regPath,
		name: name
	};
});

// Add root folder as well
registers.push({regPath: null, name: 'root'});

registers.forEach(function(el){
	gulp.task('build-register-' + el.name, function (done) {
		webpack(webpackConf.initConfig(el.path),
			function (err, stats) {
				if(err){
					console.log(err);
				}
				done();
			});
	});
});

gulp.task('build-all', registers.map(function(el){
	return 'build-register-' + el.name;
}));


// gulp lint
gulp.task('lint', function () {
	gulp.src(paths.src)
		.pipe(eslint())
		.pipe(eslint.format());
});

// gulp watcher for lint
gulp.task('watch:lint', function () {
	gulp.src(paths.src)
		.pipe(watch())
		.pipe(eslint())
		.pipe(eslint.format());
});

gulp.task('new-register', function (done) {
	inquirer.prompt([{
		type: 'input',
		name: 'register',
		message: 'Insert register name (no spaces)'
	}],
		function (params) {
			gulp.src(['.env', 'keystone.js']) // Relative to __dirname
				.pipe(gulp.dest('registers/' + params.register))
				.on('finish', function () {
					// console.log('Created register %s', params.register);
					done();
				});
		});
});
