var keystone = require('keystone');
var async = require('async');
var formatCloudinaryImage = require('../../utils/format-cloudinary-image');
var informationBlurbTypes = require('../../models/StartPage').informationBlurbTypes;
var IS_PORTAL = keystone.get('is portal');
var omitRecursive = require('../../utils/general').omitRecursive;
var convertResultsToJSON = require('../../utils/general').convertResultsToJSON;

function formatInformationBlurb (informationBlurb) {
	switch (informationBlurb.type) {
		case informationBlurbTypes.IMAGE:
			return {
				type: informationBlurbTypes.IMAGE,
				image: informationBlurb.image && formatCloudinaryImage(informationBlurb.image, null, { width: 720, height: 540, crop: 'fill' }),
			};
		case informationBlurbTypes.NEWS_ITEM: {
			var newsItem = informationBlurb.newsItem;
			if (!newsItem) {
				return {};
			}
			newsItem.image = newsItem.image && formatCloudinaryImage(newsItem.image, null, { width: 500, crop: 'fill' });
			newsItem.content = newsItem.content && newsItem.content.lead;
			return { type: informationBlurbTypes.NEWS_ITEM, newsItem: newsItem, newsItemLayout: informationBlurb.newsItemLayout };
		}
		case informationBlurbTypes.NEWS_ROLL:
			return { type: informationBlurbTypes.NEWS_ROLL };
		default:
			return {};
	}
}

exports = module.exports = function (req, res) {
	var context = {};

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
			if (IS_PORTAL) {
				return next();
			}
			keystone.list('StartPageWidget').model
			.find()
			.select('description digit linkType page link useWidget keystoneWidget widget linkText slug')
			.where('showOnStartPage', true)
			.sort('sortOrder')
			.limit(8)
			.populate('widget', 'type widget keystoneWidget')
			.populate('page', 'slug shortId')
			.exec(function (err, results) {
				convertResultsToJSON(function (err, results) {
					context.spWidgets = results;
					next(err, results);
				})(err, results);
			});
		},
		keystoneWidgets: function (next) {
			if (IS_PORTAL) {
				return next();
			}
			async.each(context.spWidgets, function (widget, cb) {
				if (widget.useWidget
						&& widget.widget && widget.widget.type === 'keystone') {
					keystone.list('KeystoneWidget').model
						.findOne()
						.select('name')
						.where('_id', widget.widget.keystoneWidget)
						.exec(function (err, kWidget) {
							if (!err && kWidget) {
								widget.keystoneWidget = kWidget.name;
							}
							cb(err);
						});
				} else {
					cb();
				}
				delete widget.widget;
			}, next);
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
		results.startPage.subRegisters = results.subRegisters;
		results.startPage.widgets = context.spWidgets;
		results.startPage.isPortal = IS_PORTAL;

		return res.apiResponse({
			success: true,
			data: omitRecursive(results.startPage, ['_id', '__v', '__t', 'updatedAt', 'updatedBy', 'createdAt']),
		});
	});
};
