var keystone = require('keystone');
var async = require('async');
var StartPage = keystone.list('StartPage');

// Changes all descriptions on start pages to markdown
exports = module.exports = function(done) {
	var context = {
		startPages: [],
	};

	async.series(
		{
			getNewsItems: function(next) {
				// Find all start pages (should be singleton...)
				StartPage.model.find(function(err, startPages) {
					if (!err) {
						context.startPages = startPages;
					}
					next(err);
				});
			},
			convertToMarkdown: function(next) {
				async.forEach(
					context.startPages,
					function(startPage, cb) {
						var description = startPage.description.toObject();
						if (!description) {
							cb();
							return;
						}
						try {
							// Save old description as markdown
							startPage.description = {
								md: description,
							};
							startPage.save(cb);
						} catch (ex) {
							cb(ex);
						}
					},
					next
				);
			},
		},
		done
	);
};
