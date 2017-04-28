var keystone = require('keystone');
var formatCloudinaryImage = require('../../utils/format-cloudinary-image');

exports = module.exports = function (req, res) {
	var	locals = res.locals;
	// Set locals
	locals.section = 'news';
	locals.breadcrumbs = [{ label: 'Nyheter', path: '/nyheter' }];
	locals.filters = {
		newsItem: req.params.newsItem,
	};
	locals.data = {};

	var states = ['published'];
	if (req.user && req.user.canAccessProtected) {
		states.push('draft');
	}

	keystone.list('NewsItem').model.findOne({
		state: { $in: states },
		slug: locals.filters.newsItem,
	})
	.or([{ publishedDate: { $lte: new Date() } }, { state: 'draft' }])
	.populate('author resources')
	.exec(function (err, newsItem) {
		if (err || !newsItem) {
			return res.apiResponse({
				success: false,
				error: err,
			});
		}

		var imageSettings = {};
		if (req.query.height && req.query.width) {
			imageSettings.width = req.query.width;
			imageSettings.height = req.query.height;
			imageSettings.crop = 'fit';
		} else {
			imageSettings.width = newsItem.imageLayout === 'landscape' ? 750 : 640;
			imageSettings.crop = 'fill';
		}
		var data = {
			publishedDate: newsItem.publishedDate,
			title: newsItem.title,
			slug: newsItem.slug,
			content: newsItem.content,
			imageLayout: newsItem.imageLayout,
			extraImages: newsItem.extraImages.map(function (image) {
				return formatCloudinaryImage(image.image, image.caption, { width: 500, crop: 'fill' });
			}),
		};
		if (newsItem.image.public_id) {
			data.image = formatCloudinaryImage(newsItem.image, newsItem.imageDescription, imageSettings);
		}
		if (newsItem.author) {
			data.author = {
				name: newsItem.author.name,
				email: newsItem.author.email,
				image: formatCloudinaryImage(newsItem.author.image, null, { width: 80, crop: 'fill', height: 80, gravity: 'face' }),
			};
		}
		if (newsItem.resources) {
			data.resources = newsItem.resources.map(function (resource) {
				return {
					title: resource.title,
					description: resource.description,
					fileUrl: resource.fileUrl,
					fileType: resource.fileType,
				};
			});
		}
		return res.apiResponse({
			success: true,
			data: data,
		});
	});

};
