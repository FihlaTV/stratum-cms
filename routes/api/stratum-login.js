var keystone = require('keystone'),
	url = require('url'),
	request = require('request'),
	zlib = require('zlib');

/**
 * Returns a function which performs a GET or POST 
 * request and gunzips the response if necessary.
 * 
 * @param conf config object for request
 * @param post boolean determines if the request should be a post call or get call.
 */
function doRequest(conf, res, req, post) {
	var reqFunc = post ? request.post : request;
	return reqFunc(conf, function (err, stratumRes, body) {
		if (!err && body) {
			if (stratumRes.headers['content-encoding'] === 'gzip') {
				zlib.gunzip(body, function (err, dezipped) {
					parseResponse(req, res, dezipped.toString('utf-8'), post);	
				});
			} else {
				parseResponse(req, res, body, post);
			}
		} else {
			return res.status(500).apiResponse({
				success: false,
				code: 'UNKNOWN_STRATUM_ERROR',
				message: 'Server error'
			});
		}
	});
}

function parseResponse(req, res, body, post) {
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
		if(post && jsonBody.code === 1) {
			jsonBody = {
				success: false,
				code: 'ASSIGN_WRONG_CREDENTIALS',
				message: 'Wrong username and/or password provided'
			};
		} else{
			jsonBody = {
				success: false,
				code: 'CONTEXT_ERROR',
				message: 'Could not find user data, most likely error with login synchronization'
			};
		}
	}

	return res.apiResponse(jsonBody);
}

exports = module.exports = function (req, res) {
	var referer = req.header('referer'),
		protocol = referer ? referer.split('/')[0] :
			req.secure ? 'https:' : 'http:',
		stratumServer = protocol + '//' + keystone.get('stratum server'),
		conf = {
			rejectUnauthorized: false,
			encoding: null
		};

	if (!stratumServer) {
		return res.apiResponse({
			success: false,
			message: 'Stratum URI lookup error'
		});
	}
	// req.url should be either /api/authentication/context or /api/authentication/login
	// might be better to hard code these
	conf.uri = url.resolve(stratumServer, req.url);
	if(req.method === 'POST'){
		conf.headers = {
			'Cookie': req.headers['cookie'],
			'User-Agent': req.headers['user-agent'],
		};
		conf.form = req.body;
		doRequest(conf, res, req, true);
		return;
	}
	req.pipe(doRequest(conf, res, req));
};
