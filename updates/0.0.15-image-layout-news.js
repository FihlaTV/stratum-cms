var keystone = require('keystone');
var	async = require('async');
var	NewsItem = keystone.list('NewsItem');

/**
 * Adds a default value to the imageLayout field on all NewsItems
 */
exports = module.exports = function (done) {
	var context = {
		newsItems: [],
	};

	async.series({
		getNewsItems: function (next) {
			NewsItem.model
				.find({ imageLayout: { $exists: false } })
				.exec(function (err, newsItems) {
					if (!err) {
						context.newsItems = newsItems;
					}
					next(err);
				});
		},
		addImageLayoutDefault: function (next) {
			async.forEach(context.newsItems, function (newsItem, cb) {
				newsItem.set('imageLayout', 'portrait');
				newsItem.save(cb);
			}, next);
		},
	}, done);
};
