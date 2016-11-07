var keystone = require('keystone');

exports = module.exports = function (req, res) {

	var filters = {
		shortId: req.params.id,
	};
	keystone.list('BasePage').model
		.findOne()
		.where('shortId', filters.shortId)
		.exec(function (err, results) {
			if (err) {
				return res.apiResponse({
					success: false,
					error: err,
				});
			}
			return res.apiResponse({
				success: true,
				data: results,
			});
		});
};
