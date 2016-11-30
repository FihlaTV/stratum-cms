var keystone = require('keystone');
var async = require('async');

exports = module.exports = function (req, res) {
	var context = {};
	async.series({
		startPage: function (next) {
			keystone.list('StartPage').model
				.findOne()
				.select('header description.html jumbotron informationBlurb quickLink')
				.populate('informationBlurb.newsItem', 'image title slug imageLayout publishedDate content.lead')
				.populate('quickLink.page', 'slug shortId')
				.exec(function (err, startPage) {
					if (!err && startPage) {
						context.startPage = startPage;
					}
					next(err, startPage);
				});
		},
		startPageWidgets: function (next) {
			keystone.list('StartPageWidget').model
			.find()
			.where('showOnStartPage', true)
			.sort('sortOrder')
			.limit(8)
			.populate('widget')
			.populate('page', 'slug shortId')
			.exec(next);
		},
		newsItems: function (next) {
			keystone.list('NewsItem').model
			.find()
			.where('state', 'published')
			.where('publishedDate', {
				$exists: true,
			})
			.sort('-publishedDate')
			.limit(3)
			.populate('author')
			.exec(next);
		},
		subRegisters: function (next) {
			if (!keystone.get('is portal')) {
				next();
				return;
			}
			keystone.list('SubRegister').model
				.find()
				.sort('sortOrder')
				.exec(next);
		},
	}, function (err, results) {

		if (err) {
			return res.apiResponse({
				success: false,
				error: err,
			});
		}

		return res.apiResponse({
			success: true,
			data: results,
		});
	});


	// // Populate StartPageWidgets with dynamic Widgets
	// view.on('init', function (next) {
	// 	var startPageWidgets = locals.data.startPageWidgets;
	// 	async.each(startPageWidgets, function (widget, cb) {
	// 		// Only works with KeystoneWidget for now
	// 		if (widget.useWidget
	// 				&& widget.widget && widget.widget.type === 'keystone') {
	// 			if (widget.linkType === 'page' && widget.page) {
	// 				widget.link = widget.page.directPath;
	// 			}
	// 			keystone.list('KeystoneWidget').model
	// 				.findOne()
	// 				.where('_id', widget.widget.keystoneWidget)
	// 				.exec(function (err, kWidget) {
	// 					if (!err) {
	// 						widget.keystoneWidget = kWidget;
	// 					}
	// 					cb(err);
	// 				});
	// 		} else {
	// 			cb();
	// 		}
	// 	}, next);
	// });


};
