var keystone = require('keystone');
var formatCloudinaryImage = require('../../utils/format-cloudinary-image');

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
				displayPrintButton: results.displayPrintButton,
				extraImages: results.extraImages.map(function (image) {
					return formatCloudinaryImage(image.image, image.caption, { width: 500, crop: 'fill' });
				}),
			};
			if (results.image.exists) {
				data.image = formatCloudinaryImage(results.image, results.imageDescription, { width: 750, crop: 'fill' });
			}
			return res.apiResponse({
				success: true,
				data: data,
			});
		});
};
