var request = require('request');
var	keystone = require('keystone');

exports = module.exports = function (req, res, next) {
	var referer;
	var isDemo;
	var protocol;
	var	stratumUrl;
	var uri;

	if (!(/^\/stratum\/[^\/]/).test(req.url)) {
		return next();
	}
	referer = req.header('referer');
	isDemo = keystone.get('is demo');

	if (isDemo) {
		protocol = 'http:';
	} else if (referer) {
		protocol = referer.split('/')[0];
	} else {
		protocol = req.secure ? 'https:' : 'http:';
	}
	// Might be a good idea to have a more fail safe approach to this string concatenation.
	stratumUrl = protocol + '//' + keystone.get('stratum server') + '/';

	uri = req.url.replace(/^\/stratum\//, stratumUrl);

	req.pipe(
		request(uri)
	).pipe(res);
};
