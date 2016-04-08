var keystone = require('keystone'),
	async = require('async'),
    shortid = require('shortid'),
	BasePage = keystone.list('BasePage');

//Set all instances of layout = wide and set to standard
exports = module.exports = function (done) {
	var context = {
		pages: []
	};

	async.series({
		getAllPages: function (next) {
			BasePage.model
				.find({shortId: {$exists: false}})
				.exec(function (err, pages) {
					if (!err) {
						context.pages = pages;
					}
					next(err);
				});
		},
		generateShortId: function (next) {
			async.forEach(context.pages, function (page, cb) {
				page.set('shortId', shortid.generate());
				page.save(cb);
			}, next);
		}
	}, done);
};
