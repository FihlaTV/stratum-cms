var keystone = require('keystone');
var cloudinary = require('cloudinary');

exports = module.exports = function (req, res) {

	var filters = {
		shortId: req.params.id,
	};
	keystone.list('BasePage').model
		.findOne()
		.where('shortId', filters.shortId)
		.exec(function (err, results) {
			if (err || !results) {
				return res.apiResponse({
					success: false,
					error: err,
				});
			}
			var data = {
				shortId: results.shortId,
				title: results.title,
				subtitle: results.subtitle,
				slug: results.slug,
				pageType: results.pageType,
				lead: results.lead,
				content: results.content,
				layout: results.layout,
				contentType: results.contentType,
			};
			if (results.image.exists) {
				data.image = {
					url: cloudinary.url(results.image.public_id, {
						secure: true,
						format: 'jpg',
						width: 750,
						crop: 'fill',
					}),
					width: 750,
					crop: 'fill',
				};
				data.imageDescription = results.imageDescription;
			}
			return res.apiResponse({
				success: true,
				data: data,
			});
		});
};
