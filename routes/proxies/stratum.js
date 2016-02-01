var request = require('request'),
	keystone = require('keystone');

exports = module.exports = function(req, res) {
	var protocol = req.headers['referer'].split('/')[0] + '//',
	// Might be a good idea to have a more fail safe approach to this string concatenation.
		stratumUrl = protocol + '//' + keystone.get('stratum server') + '/',
		uri;

	if (!(/^\/stratum\/[^\/]/).test(req.url)) {
		res.status(404)
			.send('Not found');
		return;
	}
	uri = req.url.replace(/^\/stratum\//, stratumUrl);

	if (req.url.toLowerCase().indexOf('/stratum/directs/handlers/requestmanager') === 0) {
		// body-parser prevents the simple proxy to work. 
		// https://github.com/request/request/issues/1664 
		// http://stackoverflow.com/questions/26121830/proxy-json-requests-with-node-express. 
		// This could be solved (and be more  efficient) if done earlier in the call chain, to avoid body-parser from
		// intercepting and parsing the request first.
		request.post({ 
			uri: uri, 
			form: req.headers['content-type'].indexOf('application/json') === 0 ? JSON.stringify(req.body) : req.body, 
			headers: {
				'Cookie': req.headers['cookie'],
				'User-Agent': req.headers['user-agent'],
				'Content-Length': req.headers['content-length'],
				'Content-Type': req.headers['content-type'],
			} 
		}).pipe(res);
		return;
	}
	req.pipe(
		request(uri)
	).pipe(res);
};
