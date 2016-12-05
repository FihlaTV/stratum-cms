var keystone = require('keystone');
var async = require('async');
var formatCloudinaryImage = require('../../utils/format-cloudinary-image');
var informationBlurbTypes = require('../../models/StartPage').informationBlurbTypes;

function formatInformationBlurb (informationBlurb) {
	switch (informationBlurb.type) {
		case informationBlurbTypes.IMAGE:
			return { type: informationBlurbTypes.IMAGE, image: formatCloudinaryImage(informationBlurb.image, null, { width: 500, crop: 'fill' }) };
		case informationBlurbTypes.NEWS_ITEM: {
			var newsItem = informationBlurb.newsItem;
			if (!newsItem) {
				return {};
			}
			newsItem.image = formatCloudinaryImage(newsItem.image, null, { width: 500, crop: 'fill' });
			newsItem.content = newsItem.content && newsItem.content.lead;
			return { type: informationBlurbTypes.NEWS_ITEM, newsItem: newsItem, newsItemLayout: informationBlurb.newsItemLayout };
		}
		default:
			return {};
	}
}

exports = module.exports = function (req, res) {
	// var context = {};
	async.series({
		startPage: function (next) {
			keystone.list('StartPage').model
				.findOne()
				.select('header description.html jumbotron.description.html jumbotron.header jumbotron.isVisible informationBlurb quickLink')
				.populate('informationBlurb.newsItem', 'image title slug imageLayout publishedDate content.lead')
				.populate('quickLink.page', 'slug shortId')
				.exec(function (err, startPage) {
					var sp;
					if (!err && startPage) {
						sp = startPage.toObject();
						delete sp._id;
					}
					next(err, sp);
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
			.select('slug title publishedDate content.lead image')
			.where('state', 'published')
			.where('publishedDate', {
				$exists: true,
			})
			.sort('-publishedDate')
			.limit(3)
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
		var informationBlurb;
		if (err) {
			return res.apiResponse({
				success: false,
				error: err,
			});
		}
		informationBlurb = results.startPage.informationBlurb;
		if (informationBlurb) {
			// If no news item is pointed out set it to the lates occuring news item.
			if (informationBlurb.type === informationBlurbTypes.NEWS_ITEM && !informationBlurb.newsItem) {
				informationBlurb.newsItem = results.newsItems[0];
			}
			results.startPage.informationBlurb = formatInformationBlurb(informationBlurb);
		}
		results.startPage.widgets = results.startPageWidgets;

		return res.apiResponse({
			success: true,
			data: results.startPage,
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
