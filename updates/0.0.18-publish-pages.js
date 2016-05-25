var keystone = require('keystone'),
	async = require('async'),
	BasePage = keystone.list('BasePage');

/**
 * Changes all current Page states to published since this has not been
 * functional until now
 */
exports = module.exports = function (done) {
	var context = {
		pages: []
	};

	async.series({
		getPages: function (next) {
			BasePage.model
				.find()
				.exec(function (err, pages) {
					if (!err) {
						context.pages = pages;
					}
					next(err);
				});
		},
		changeAllPagesToPublished: function (next) {
			async.forEach(context.pages, function (page, cb) {
				page.set('state', 'published');
				page.save(cb);
			}, next);
		}
	}, done);
};
