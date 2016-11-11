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


	keystone.list('NewsItem').model.findOne({
		state: 'published',
		slug: locals.filters.newsItem,
		publishedDate: { $lte: new Date() },
	})
	.populate('author resources')
	.exec(function (err, newsItem) {
		if (!err) {
			if (!newsItem) {
				res.notFound(null, 'Det gick inte att hitta någon nyhet som matchade den adress du angav...');
				return;
			}

			var data = {
				publishedDate: newsItem.publishedDate,
				title: newsItem.title,
				slug: newsItem.slug,
				author: newsItem.author,
				resources: newsItem.resources,
				content: newsItem.content,
				imageLayout: newsItem.imageLayout,
				image: formatCloudinaryImage(newsItem.image, newsItem.imageDescription),
			};
			return res.apiResponse({
				success: true,
				data: data,
			});
		}
	});

};
