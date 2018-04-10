var keystone = require('keystone');
var async = require('async');
var BasePage = keystone.list('BasePage');

// Set all instances of layout = wide and set to standard
exports = module.exports = function(done) {
	var context = {
		pages: [],
	};

	async.series(
		{
			getAllPages: function(next) {
				BasePage.model.find().exec(function(err, pages) {
					if (!err) {
						context.pages = pages;
					}
					next(err);
				});
			},
			addContentType: function(next) {
				async.forEach(
					context.pages,
					function(page, cb) {
						page.set('resourcePlacement', 'right');
						page.save(cb);
					},
					next
				);
			},
		},
		done
	);
};
