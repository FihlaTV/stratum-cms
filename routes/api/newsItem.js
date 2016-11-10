var keystone = require('keystone');

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
	.populate('resources')
	.exec(function (err, newsItem) {
		if (!err) {
			if (!newsItem) {
				res.notFound(null, 'Det gick inte att hitta någon nyhet som matchade den adress du angav...');
				return;
			}
			res.apiResponse({
				success: true,
				data: newsItem,
			});
		}
	});

};
