var keystone = require('keystone'),
	async = require('async'),
	toMarkdown = require('to-markdown'),
	NewsItem = keystone.list('NewsItem');

//Changes all news items with extended content in html into markdown
exports = module.exports = function(done) {
	var context = {
		newsItems: []
	};

	async.series({
		getNewsItems: function(next) {
			//Find all news items
			NewsItem.model
				.find(function(err, newsItems) {
					if (!err) {
						context.newsItems = newsItems;
					}
					next(err);
				});
		},
		convertToMarkdown: function(next) {
			async.forEach(context.newsItems, function(newsItem, cb) {
				var content = newsItem.content.toObject();
				if(!content || !content.extended){
					cb();
					return;
				}
				try{
					//Convert html to markdown
					var md = toMarkdown(content.extended);
					newsItem.content.extended = {
						md: md
					};
					newsItem.save(cb);
				} catch(ex){
					cb(ex);
				}
			}, next);
		}
	}, done);
};
