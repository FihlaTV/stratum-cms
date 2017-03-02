var	path = require('path');
var glob = require('glob');
var async = require('async');
var exec = require('child_process').exec;
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
// var seriesFn = inParallel ? async.each : async.eachSeries;

console.time('total');
async.eachLimit(registers, limit, function (register, cb) {
	console.time(register.name);
	console.log('building register ' + register.name);
	exec(['node_modules\\.bin\\webpack -p --config webpack.production.config --env.regPath', register.path, '\\.env'].join(''), function (error, stdout, stderr) {
		// console.log('stdout: ' + stdout);
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

