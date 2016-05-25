var keystone = require('keystone'),
	async = require('async'),
	BasePage = keystone.list('BasePage');

/**
 * Changes all size attributes on widget to default 'small'
 */
exports = module.exports = function (done) {
	var context = {
		pages: []
	};

	async.series({
		getPages: function (next) {
			BasePage.model
				.find({contentType: 'contact'})
				.exec(function (err, pages) {
					if (!err) {
						context.pages = pages;
					}
					next(err);
				});
		},
		changeContactToDefault: function (next) {
			async.forEach(context.pages, function (page, cb) {
				page.set('contentType', 'default');
				page.save(cb);
			}, next);
		}
	}, done);
};
