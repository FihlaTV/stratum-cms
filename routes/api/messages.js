var keystone = require('keystone');

exports = module.exports = function (req, res) {
	var currentTime = new Date();

	var q = keystone.list('Message').model
		.find()
		.where('startTime', { $exists: true, $lte: currentTime })
		.where('endTime', { $exists: true, $gte: currentTime })
		.select('title startTime endTime sortOrder message dismissible status')
		.sort('sortOrder')
		.exec(function (err, results) {
			if(err){
				return res.apiResponse({
					success: false,
					error: err
				});
			}
			return res.apiResponse({
				success: true,
				data: {
					messages: results
				}
			});
		});
};
