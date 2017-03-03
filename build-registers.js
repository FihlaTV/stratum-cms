var	path = require('path');
var glob = require('glob');
var async = require('async');
var exec = require('child_process').exec;
var webpack = 'node_modules\\.bin\\webpack';
// Finds all instances of .env-files in register folders
var registers = glob.sync('./registers/*/.env').map(function (stylePath) {
	var regPath = path.resolve(stylePath, '..').replace(__dirname, '.');
	var name = regPath.replace('.\\registers\\', '');
	return {
		path: regPath,
		name: name,
	};
});
var inParallel = process.argv.indexOf('-p') !== -1;
var limit = 1;
var limitArg = process.argv.indexOf('-l');
if (inParallel) {
	limit = limitArg !== -1 ? parseInt(process.argv[limitArg + 1]) : 4;
}

console.time('total');
async.eachLimit(registers, limit, function (register, cb) {
	console.time(register.name);
	console.log('building register ' + register.name);
	exec([webpack, '-p', '--config', 'webpack.production.config', '--env.regPath', register.path].join(' '), function (error, stdout, stderr) {
		if (stderr) {
			console.log('stderr (' + register.name + '): ' + stderr);
		}
		console.timeEnd(register.name);
		cb(error, stdout);
	});
}, function (err) {
	console.log('When running in ' + inParallel ? 'parallel' : 'series, with ' + limit + ' threads');
	console.timeEnd('total');
	console.log('err', err);
});

