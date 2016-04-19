var keystone = require('keystone'),
	url = require('url'),
	request = require('request');
// var zlib = require('zlib');

exports = module.exports = function(req, res) {
	var referer = req.header('referer'),
		protocol = referer ? referer.split('/')[0] : 
			req.secure ? 'https:' : 'http:',
		stratumServer = protocol + '//' + keystone.get('stratum server'),
		
		apiUrl;

	if (!stratumServer) {
		return res.apiResponse({
			success: false,
			message: 'Stratum URI lookup error'
		});
	}
	apiUrl = url.resolve(stratumServer, '/api/authentication/login');
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
					code: 'PARSE_ERROR',
					message: 'Error handling authentication request'
				});
				// delete req.session.contextId;
			}
			if (req.session && jsonBody.success && jsonBody.data && jsonBody.data.ContextID) {
				req.session.contextId = jsonBody.data.ContextID;
				req.session.stratumUser = jsonBody.data.User;
			} else {
				delete req.session.contextId;
				delete req.session.stratumUser;
				jsonBody = {
					success: false,
					code: 'CONTEXT_ERROR',
					message: 'Could not find user data, most likely error with login synchronization'
				};
			}
		} else {
			jsonBody = {
				success: false,
				code: 'UNKNOWN_STRATUM_ERROR',
				message: 'Server error'
			};
		}
		return res.apiResponse(jsonBody);
	}));
};
