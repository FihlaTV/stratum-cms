var keystone = require('keystone');

exports = module.exports = function(req, res) {
	keystone
		.list('RegisterInformation')
		.model.findOne()
		.sort('sortOrder')
		.select('name phone email location showMap longitude latitude')
		.exec(function(err, results) {
			var registerInformation;
			if (err) {
				return res.apiResponse({
					success: false,
					error: err,
				});
			}
			registerInformation = results.toObject();
			delete registerInformation._id;

			return res.apiResponse({
				success: true,
				data: registerInformation,
			});
		});
};
