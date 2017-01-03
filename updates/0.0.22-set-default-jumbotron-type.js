var keystone = require('keystone');
var	async = require('async');
var	StartPage = keystone.list('StartPage');

// Set all instances of layout = wide and set to standard
exports = module.exports = function (done) {
	var context = {
		pages: [],
	};

	async.series({
		getAllPages: function (next) {
			StartPage.model
				.find()
				.exec(function (err, pages) {
					if (!err) {
						context.pages = pages;
					}
					next(err);
				});
		},
		setDefaultJumbotronType: function (next) {
			async.forEach(context.pages, function (page, cb) {
				page.set('jumbotron.type', 'default');
				page.save(cb);
			}, next);
		},
	}, done);
};
