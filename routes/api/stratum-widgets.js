var stratum = require('../../utils/stratum');

exports = module.exports = function(req, res) {
	stratum.loadWidgets(function(err, context) {
		if (err) {
			return res.apiResponse({
				sucess: false,
				err: err
			});
		} else {
			return res.apiResponse({
				success: true,
				data: {
					removed: context.nRemoved,
					new: context.nNew
				}
			});
		}
	});
};
