var keystone = require('keystone');
var	async = require('async');

exports.updateCount = function (cb) {
	var context = { pagesUpdated: 0 };
	var Page = keystone.list('Page');
	var SubPage = keystone.list('SubPage');

	Page.model
		.find()
		.exec(function (err, pages) {
			if (err) {
				return;
			}
			async.each(pages,
				function (page, callback) {
					context.pagesUpdated++;
					SubPage.model
						.where('page', page._id)
						.where('state', 'published')
						.count(function (err, count) {
							if (!err) {
								page.set('numberOfSubPages', count);
								page.save(callback);
							} else {
								callback(err);
							}
						});
				},
				function (err) {
					if (cb) {
						cb(err, context);
					} else if (err) {
						throw err;
					}
				});
		});
};
