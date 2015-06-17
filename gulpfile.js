var gulp = require('gulp'),
	eslint = require('gulp-eslint'),
	watch = require('gulp-watch'),
	inquirer = require('inquirer'),
	fs = require('fs'),
	path = require('path'),
	merge = require('merge-stream'),
	iis = require('IIS');

require('dotenv').load();
/*
 * Create variables for our project paths so we can change in one place
 */
var paths = {
	'src': ['./models/**/*.js', './routes/**/*.js', 'keystone.js']
};


// gulp lint
gulp.task('lint', function() {
	gulp.src(paths.src)
		.pipe(eslint())
		.pipe(eslint.format());
});

// gulp watcher for lint
gulp.task('watch:lint', function() {
	gulp.src(paths.src)
		.pipe(watch())
		.pipe(eslint())
		.pipe(eslint.format());
});

// gulp watcher for recycling the app pool running keystone on iisnode
gulp.task('watch:iis', function() {
	var appPool = process.env.IIS_APP_POOL;
	if (!appPool) {
		console.log('IIS_APP_POOL is not defined in .env');
		return;
	}
	gulp.watch(paths.src)
		.on('change', function(file) {
			console.log('file changed: ' + file.path);
			iis.recycleAppPool(appPool, function(err, output) {
				console.log(output.toString());
				if (err) {
					console.log(err);
				}
			});
		});
});

gulp.task('new-register', function(done) {
	inquirer.prompt([{
			type: 'input',
			name: 'register',
			message: 'Insert register name (no spaces)'
		}],
		function(params) {
			gulp.src(['.env', 'keystone.js']) // Relative to __dirname
				.pipe(gulp.dest('registers/' + params.register))
				.on('finish', function() {
					// console.log('Created register %s', params.register);
					done();
				});
		});
});

function getFolders(dir) {
	return fs.readdirSync(dir)
		.filter(function(file) {
			return fs.statSync(path.join(dir, file)).isDirectory();
		});
}

gulp.task('update-registers', function() {
	var registersFolder = 'registers/',
		folders = getFolders(registersFolder);

	var tasks = folders.map(function(folder) {
		return gulp.src('keystone.js')
			.pipe(gulp.dest(path.join(registersFolder, folder)));
	});
	return merge(tasks);
});
