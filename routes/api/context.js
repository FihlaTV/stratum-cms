var keystone = require('keystone'),
	url = require('url'),
	request = require('request');
// var zlib = require('zlib');

exports = module.exports = function(req, res) {
	var stratumServer = keystone.get('stratum server'),
		apiUrl;

	if (!stratumServer) {
		return res.apiResponse({
			success: false,
			error: 'Server error'
		});
	}
	apiUrl = url.resolve(stratumServer, '/api/authenticate/context');
	req.headers['accept-encoding'] = 'gzip;q=0,deflate,sdch';

	req.pipe(request({
		rejectUnauthorized: false,
		url: apiUrl
	}, function(err, stratumRes, body) {
		var jsonBody;
		if (!err && body) {
			try {
				jsonBody = JSON.parse(body);
			} catch (e) {
				console.log(e);
				jsonBody = {};
				return res.apiResponse({
					success: false,
					error: 'Error handling authentication request'
				});
				// delete req.session.contextId;
			}
			if (req.session && jsonBody.success && jsonBody.data && jsonBody.data.ContextID) {
				req.session.contextId = jsonBody.data.ContextID;
				req.session.stratumUser = jsonBody.data.User;
			} else {
				delete req.session.contextId;
				delete req.session.stratumUser;
			}
		} else {
			jsonBody = {
				success: false,
				error: 'Server error'
			};
		}
		return res.apiResponse(jsonBody);
	}));
};
