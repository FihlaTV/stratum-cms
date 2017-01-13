var keystone = require('keystone');
var formatCloudinaryImage = require('../../utils/format-cloudinary-image');
var async = require('async');

exports = module.exports = function (req, res) {

	var filters = {
		shortId: req.params.id,
	};
	var context = {};
	async.series({
		page: function (next) {
			keystone.list('BasePage').model
				.findOne()
				.where('shortId', filters.shortId)
				.populate('contacts', 'name description email phone image')
				.populate('resources')
				.populate('widget')
				.populate('page', 'shortId title slug')
				.select('shortId title subtitle slug pageType widget resourcePlacement lead content.html layout contentType displayPrintButton extraImage contacts resources page image questionCategories sideArea')
				.exec(function (err, page) {
					context.widget = page && page.widget;
					return next(err, page);
				});
		},
		widget: function (next) {
			if (!context.widget) {
				return next();
			}
			if (context.widget.type === 'keystone') {
				keystone.list('KeystoneWidget').model
					.findOne()
					.select('description name')
					.where('_id', context.widget.keystoneWidget)
					.where('removed', false)
					.exec(next);
			} else if (context.widget.type === 'stratum') {
				keystone.list('StratumWidget').model
					.findOne()
					.select('pageId slug widgetSlug')
					.where('_id', context.widget.stratumWidget)
					.where('removed', false)
					.exec(next);
			} else {
				next(null, context.widget);
			}
		},
	}, function (err, results) {
		var page = results.page;
		if (err || !page) {
			return res.apiResponse({
				success: false,
				error: err,
			});
		}
		var data = {
			shortId: page.shortId,
			title: page.title,
			subtitle: page.subtitle,
			slug: page.slug,
			pageType: page.pageType,
			lead: page.lead,
			content: page.content,
			layout: page.layout,
			contentType: page.contentType,
			displayPrintButton: page.displayPrintButton,
			resourcePlacement: page.resourcePlacement,
			widget: page.widget,
			extraImages: page.extraImages.map(function (image) {
				return formatCloudinaryImage(image.image, image.caption, { width: 500, crop: 'fill' });
			}),
			contacts: page.contacts.map(function (contact) {
				return {
					name: contact.name.full,
					description: contact.description,
					email: contact.email,
					phone: contact.phone,
					image: formatCloudinaryImage(contact.image, null, { width: 160, height: 160, crop: 'thumb', gravity: 'face' }),
				};
			}),
			questionCategories: page.questionCategories,
			resources: page.resources.map(function (resource) {
				return {
					title: resource.title,
					description: resource.description,
					fileUrl: resource.fileUrl,
					fileType: resource.fileType,
				};
			}),
			sideArea: page.sideArea && page.sideArea.show && page.sideArea,
		};
		if (page.image.exists) {
			data.image = formatCloudinaryImage(page.image, page.imageDescription, { width: 750, crop: 'fill' });
		}
		if (page.pageType === 'SubPage') {
			data.parentPage = page.get('page').toObject();
			delete data.parentPage._id;
			delete data.parentPage.__v;
			delete data.parentPage.__t;
			delete data.page;
		}
		if (results.widget) {
			data.widget = results.widget.toObject();
			data.widget.type = context.widget.type;
			delete data.widget._id;
		}
		return res.apiResponse({
			success: true,
			data: data,
			widget: results.widget,
		});
	});
};
