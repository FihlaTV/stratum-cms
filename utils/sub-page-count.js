var keystone = require('keystone'),
	async = require('async');

exports.updateCount = function (cb) {
	var context = {pagesUpdated: 0},
	Page = keystone.list('Page'),
	SubPage = keystone.list('SubPage');
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
							if(!err){
								page.set('numberOfSubPages', count);
								page.save(callback);
							} else {
								callback(err);
							}
						});
				},
				function (err) {
					if(cb){
						cb(err, context);
					} else if(err) {
						throw err;
					}
				});
		});
};
