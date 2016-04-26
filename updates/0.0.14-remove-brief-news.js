var keystone = require('keystone'),
	async = require('async'),
    shortid = require('shortid'),
	NewsItem = keystone.list('NewsItem');


exports = module.exports = function (done) {
	var context = {
		newsItems: []
	};

	async.series({
		getNewsItems: function (next) {
			NewsItem.model
				.find()
				.exec(function (err, newsItems) {
					if (!err) {
						context.newsItems = newsItems;
					}
					next(err);
				});
		},
		moveBrief: function (next) {
			async.forEach(context.newsItems, function (newsItem, cb) {
				if(newsItem.get('newsType') === 'brief' || newsItem.get('content.brief') && !newsItem.get('content.lead')){
					if(newsItem.get('content.lead')){
						console.log('NewsItem -- Overwritten content.lead on %s, old value: %s', newsItem.get('id'), newsItem.get('content.lead'));
					}
					newsItem.set('content.lead', newsItem.get('content.brief'));
				}
				newsItem.set('newsType', undefined, { strict: false });
				newsItem.set('content.brief', undefined, { strict: false });
				newsItem.save(cb);
			}, next);
		}
	}, done);
};
