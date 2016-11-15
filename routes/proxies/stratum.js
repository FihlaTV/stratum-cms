var request = require('request');
var	keystone = require('keystone');

exports = module.exports = function (req, res) {
	var referer = req.header('referer');
	var protocol = referer ? referer.split('/')[0]
			: req.secure ? 'https:' : 'http:';
	// Might be a good idea to have a more fail safe approach to this string concatenation.
	var	stratumUrl = protocol + '//' + keystone.get('stratum server') + '/';
	var	uri;

	if (!(/^\/stratum\/[^\/]/).test(req.url)) {
		res.notFound();
		return;
	}
	uri = req.url.replace(/^\/stratum\//, stratumUrl);

	// Special handling for REST verbs and Direct calls
	if (['POST', 'PUT'].indexOf(req.method) !== -1) {
		// body-parser prevents the simple proxy to work.
		// https://github.com/request/request/issues/1664
		// http://stackoverflow.com/questions/26121830/proxy-json-requests-with-node-express.
		// This could be solved (and be more  efficient) if done earlier in the call chain, to avoid body-parser from
		// intercepting and parsing the request first.
		request({
			uri: uri,
			rejectUnauthorized: false,
			method: req.method,
			encoding: null,
			form: req.headers['content-type'].indexOf('application/json') === 0 ? JSON.stringify(req.body) : req.body,
			headers: {
				'Cookie': req.headers.cookie,
				'User-Agent': req.headers['user-agent'],
				'Content-Length': req.headers['content-length'],
				'Content-Type': req.headers['content-type'],
			},
		}).pipe(res);
		return;
	}
	req.pipe(
		request(uri)
	).pipe(res);
};
