var keystone = require('keystone'),
	url = require('url'),
	request = require('request'),
	zlib = require('zlib');

function parseResponse(req, res, body) {
	var jsonBody;
	try {
		jsonBody = JSON.parse(body);
	} catch (e) {
		console.log(e);
		res.status(500);
		return res.apiResponse({
			success: false,
			code: 'PARSE_ERROR',
			message: 'Error handling authentication request'
		});
	}
	if (jsonBody.success && jsonBody.data && jsonBody.data.ContextID) {
		req.session.context = jsonBody.data;
		req.session.context.contextUpdated = Date.now();
	} else {
		delete req.session.context;
		// res.status(400);
		jsonBody = {
			success: false,
			code: 'CONTEXT_ERROR',
			message: 'Could not find user data, most likely error with login synchronization'
		};
	}

	return res.apiResponse(jsonBody);
}

exports = module.exports = function (req, res) {
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
	// req.url should be either /api/authentication/context or /api/authentication/login
	// might be better to hard code these
	apiUrl = url.resolve(stratumServer, req.url);

	req.pipe(request({
		rejectUnauthorized: false,
		url: apiUrl,
		encoding: null
	}, function (err, stratumRes, body) {
		if (!err && body) {
			if (stratumRes.headers['content-encoding'] === 'gzip') {
				zlib.gunzip(body, function (err, dezipped) {
					parseResponse(req, res,  dezipped.toString('utf-8'));					
				});
			} else {
				parseResponse(req, res, body);
			}
		} else {
			return res.status(500).apiResponse({
				success: false,
				code: 'UNKNOWN_STRATUM_ERROR',
				message: 'Server error'
			});
		}
	}));
};
