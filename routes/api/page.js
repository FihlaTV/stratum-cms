var keystone = require('keystone');
var formatCloudinaryImage = require('../../utils/format-cloudinary-image');

exports = module.exports = function (req, res) {

	var filters = {
		shortId: req.params.id,
	};
	keystone.list('BasePage').model
		.findOne()
		.where('shortId', filters.shortId)
		.populate('contacts', 'name description email phone image')
		.populate('page', 'shortId title slug')
		.select('shortId title subtitle slug pageType lead content.html layout contentType displayPrintButton extraImage contacts page image')
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
				contacts: results.contacts.map(function (contact) {
					return {
						name: contact.name.full,
						description: contact.description,
						email: contact.email,
						phone: contact.phone,
						image: formatCloudinaryImage(contact.image, null, { width: 160, height: 160, crop: 'thumb', gravity: 'face' }),
					};
				}),
			};
			if (results.image.exists) {
				data.image = formatCloudinaryImage(results.image, results.imageDescription, { width: 750, crop: 'fill' });
			}
			if (results.pageType === 'SubPage') {
				data.parentPage = results.get('page').toObject();
				delete data.parentPage._id;
				delete data.parentPage.__v;
				delete data.parentPage.__t;
				delete data.page;
			}
			return res.apiResponse({
				success: true,
				data: data,
			});
		});
};
