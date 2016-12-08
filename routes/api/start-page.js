var keystone = require('keystone');
var async = require('async');
var formatCloudinaryImage = require('../../utils/format-cloudinary-image');
var informationBlurbTypes = require('../../models/StartPage').informationBlurbTypes;
var IS_PORTAL = keystone.get('is portal');
// var _ = require('underscore');

// function omitRecursive (obj, iteratee, context) {
// 	var r = _.omit(obj, iteratee, context);

// 	_.each(r, function (val, key) {
// 		if (Array.isArray(val)) {
// 			r[key] = val.map(function (v) {
// 				if (typeof v === 'object') {
// 					return omitRecursive(v, iteratee, context);
// 				}
// 				return v;
// 			});
// 		}
// 		else if (typeof val === 'object') {
// 			r[key] = omitRecursive(val, iteratee, context);
// 		}
// 	});

// 	return r;
// }

function formatInformationBlurb (informationBlurb) {
	switch (informationBlurb.type) {
		case informationBlurbTypes.IMAGE:
			return { type: informationBlurbTypes.IMAGE, image: formatCloudinaryImage(informationBlurb.image, null, { width: 720, height: 540, crop: 'fill' }) };
		case informationBlurbTypes.NEWS_ITEM: {
			var newsItem = informationBlurb.newsItem;
			if (!newsItem) {
				return {};
			}
			newsItem.image = formatCloudinaryImage(newsItem.image, null, { width: 500, crop: 'fill' });
			newsItem.content = newsItem.content && newsItem.content.lead;
			return { type: informationBlurbTypes.NEWS_ITEM, newsItem: newsItem, newsItemLayout: informationBlurb.newsItemLayout };
		}
		case informationBlurbTypes.NEWS_ROLL:
			return { type: informationBlurbTypes.NEWS_ROLL };
		default:
			return {};
	}
}

function convertResultsToJSON (next) {
	return function (err, results) {
		var resultsObj;
		if (!err && results) {
			resultsObj = Array.isArray(results)
				? results.map(function (r) { return r.toObject(); })
				: results.toObject();
			// delete sp._id;
		}
		next(err, resultsObj);
	};
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
				.exec(convertResultsToJSON(next));
		},
		startPageWidgets: function (next) {
			keystone.list('StartPageWidget').model
			.find()
			.where('showOnStartPage', true)
			.sort('sortOrder')
			.limit(8)
			.populate('widget')
			.populate('page', 'slug shortId')
			.exec(convertResultsToJSON(next));
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
			.exec(convertResultsToJSON(next));
		},
		subRegisters: function (next) {
			if (!IS_PORTAL) {
				next();
				return;
			}
			keystone.list('SubRegister').model
				.find()
				.sort('sortOrder')
				.exec(convertResultsToJSON(next));
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
		results.startPage.isPortal = IS_PORTAL;

		return res.apiResponse({
			success: true,
			data: results.startPage, //omitRecursive(results.startPage, ['_id', '__v', '__t']),
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
