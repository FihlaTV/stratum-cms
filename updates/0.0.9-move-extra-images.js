var keystone = require('keystone');
var	async = require('async');
var	BasePage = keystone.list('BasePage');

var EXTRA_IMAGE_NAMES = ['one', 'two', 'three'];

// TODO
// Did not work as intended when run on dev server

// Move all images from `images` to `extraImages`
exports = module.exports = function (done) {
	var context = {
		pages: [],
	};

	async.series({
		getSubPages: function (next) {
			// Find all pages with have images
			BasePage.model
				.find()
				.exists('images')
				.where('images').ne([])
				.exec(function (err, pages) {
					if (!err) {
						context.pages = pages;
					}
					next(err);
				});
		},
		updatePages: function (next) {
			async.each(context.pages, function (page, cb) {
				var tmpImgs = {};
				var i = 0;

				if (!page || !page.images || !page.images.forEach) {
					cb();
				} else {
					page.images.forEach(function (image) {
						if (i < 3 && image && image._doc) {
							tmpImgs[EXTRA_IMAGE_NAMES[i++]] = image._doc;
						} else {
							console.log('Skipped image on page ' + page.get('slug'));
						}
					});

					// Set new images
					page.set('extraImage', tmpImgs);

					page.save(cb);
				}
			}, next);
		},
	}, done);
};
