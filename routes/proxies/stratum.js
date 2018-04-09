var request = require('request');
var keystone = require('keystone');

function getErrorHandlingFn(res, msg) {
	return function(err) {
		console.log('//--- Error in Stratum proxy: ' + (msg || '') + ' ---//');
		console.log(err);

		return res.status(500).json({ error: 'Stratum error' });
	};
}

exports = module.exports = function(req, res, next) {
	var referer;
	var protocol;
	var stratumUrl;
	var uri;

	if (!/^\/stratum\/[^\/]/.test(req.url)) {
		return next();
	}
	referer = req.header('referer');

	if (referer) {
		protocol = referer.split('/')[0];
	} else {
		protocol = req.secure ? 'https:' : 'http:';
	}
	// Might be a good idea to have a more fail safe approach to this string concatenation.
	stratumUrl = protocol + '//' + keystone.get('stratum server') + '/';

	uri = req.url.replace(/^\/stratum\//, stratumUrl);

	req
		.pipe(request(uri))
		.on('error', getErrorHandlingFn(res, 'on request to stratum'))
		.pipe(res)
		.on('error', getErrorHandlingFn(res, 'on response pipe'));
};
