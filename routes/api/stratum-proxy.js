// var keystone = require('keystone');
var request = require('request');
// var zlib = require('zlib');

exports = module.exports = function(req, res) {
	var url;

	if (!(/^\/stratum\/[^\/]/).test(req.url)) {
		res.status(404)
			.send('Not found');
		return;
	}
	url = req.url.replace(/^\/stratum\//, 'https://stratum.registercentrum.se/');

	request(url).pipe(res);
};
