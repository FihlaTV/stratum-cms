var keystone = require('keystone');

exports = module.exports = function (req, res) {
	var currentTime = new Date();
	var states = ['published'];
	if (req.user && req.user.canAccessKeystone) {
		states.push('draft');
	}

	keystone.list('NewsItem').model
		.find({ state: { $in: states } })
		.or([{ publishedDate: { $exists: true, $lte: currentTime } }, { state: 'draft' }])
		.sort('-publishedDate')
		.select('content.lead title publishedDate slug state')
		.exec(function (err, results) {
			if (err) {
				return res.apiResponse({
					success: false,
					error: err,
				});
			}

			return res.apiResponse({
				success: true,
				data: {
					news: results,
				},
			});
		});
};
