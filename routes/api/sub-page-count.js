var subPageCount = require('../../utils/sub-page-count');

exports = module.exports = function (req, res) {
	subPageCount.updateCount(function (err, data) {
		return res.apiResponse({
			success: !err,
			data: data,
		});
	});
};
