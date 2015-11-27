var request = require('request');

exports = module.exports = function(req, res) {
	var protocol = req.secure ? 'https' : 'http',
		stratumUrl = protocol + '://stratum.registercentrum.se/',
		url;

	if (!(/^\/stratum\/[^\/]/).test(req.url)) {
		res.status(404)
			.send('Not found');
		return;
	}
	url = req.url.replace(/^\/stratum\//, stratumUrl);

	req.pipe(
		request(url)
	).pipe(res);
};
