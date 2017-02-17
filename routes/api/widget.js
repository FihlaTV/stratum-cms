var keystone = require('keystone');
var omitRecursive = require('../../utils/general').omitRecursive;

exports = module.exports = function (req, res) {

	var filters = {
		id: req.params.id,
	};
	keystone.list('Widget').model
		.findOne()
		.where('_id', filters.id)
		.populate('stratumWidget', 'slug removed description widgetSlug')
		.populate('keystoneWidget')
		.select('name description stratumWidget keystoneWidget type size')
		.exec(function (err, results) {
			if (err || !results) {
				return res.apiResponse({
					success: false,
					error: err,
				});
			}
			var data = results.toObject();
			return res.apiResponse({
				success: true,
				data: omitRecursive(data),
			});
		});
};
