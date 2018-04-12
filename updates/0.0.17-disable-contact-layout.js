var keystone = require('keystone');
var async = require('async');
var BasePage = keystone.list('BasePage');

/**
 * Since contact has been removed this will set all instances
 * where contentType is contact to a default page instead in
 * order to be a valid page.
 */
exports = module.exports = function(done) {
	var context = {
		pages: [],
	};

	async.series(
		{
			getPages: function(next) {
				BasePage.model
					.find({ contentType: 'contact' })
					.exec(function(err, pages) {
						if (!err) {
							context.pages = pages;
						}
						next(err);
					});
			},
			changeContactToDefault: function(next) {
				async.forEach(
					context.pages,
					function(page, cb) {
						page.set('contentType', 'default');
						page.save(cb);
					},
					next
				);
			},
		},
		done
	);
};
