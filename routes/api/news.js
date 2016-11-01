var keystone = require('keystone');

exports = module.exports = function (req, res) {
	var currentTime = new Date();

	keystone.list('NewsItem').model
		.find({ state: 'published' })
		.where('publishedDate', { $exists: true, $lte: currentTime })
		.select('content.lead title publishedDate slug')
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
