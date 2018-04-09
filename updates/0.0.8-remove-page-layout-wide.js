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
			getSubPages: function(next) {
				// Find all pages
				BasePage.model
					.find({ layout: 'wide' })
					.exec(function(err, pages) {
						if (!err) {
							context.pages = pages;
						}
						next(err);
					});
			},
			updatePages: function(next) {
				async.forEach(
					context.pages,
					function(page, cb) {
						page.set('layout', 'standard');
						page.save(cb);
					},
					next
				);
			},
		},
		done
	);
};
