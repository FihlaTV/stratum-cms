var request = require('request'),
	keystone = require('keystone');

exports = module.exports = function(req, res) {
	var protocol = req.secure ? 'https://' : 'http://',
		stratumUrl = protocol + keystone.get('stratum server') + '/',
		uri;

	if (!(/^\/stratum\/[^\/]/).test(req.url)) {
		res.status(404)
			.send('Not found');
		return;
	}
	uri = req.url.replace(/^\/stratum\//, stratumUrl);

	req.pipe(
		request(uri)
	).pipe(res);
};
