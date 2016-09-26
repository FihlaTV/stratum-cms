var keystone = require('keystone');
var	async = require('async');
var	_ = require('underscore');

exports = module.exports = function (req, res) {
	var context = {
		menuBlocks: [],
		subPages: [],
		pages: [],
		paths: {},
	};
	async.series({
		getMenus: function (next) {
			keystone.list('MenuBlock').model
					.find()
					.exec(function (err, menuBlocks) {
						if (!err) {
							context.menuBlocks = menuBlocks;
						}
						next(err);
					});
		},
		getPages: function (next) {
			keystone.list('Page').model
					.find()
					.populate('menu')
					.sort('sortOrder')
					.exec(function (err, pages) {
						if (!err) {
							context.pages = pages;
						}
						next(err);
					});
		},
		getSubPages: function (next) {
			keystone.list('SubPage').model
					.find()
					.populate('page')
					.sort('sortOrder')
					.exec(function (err, subPages) {
						if (!err) {
							context.subPages = subPages;
						}
						next(err);
					});
		},
		categorizePages: function (next) {
			async.each(context.pages, function (page, cb) {
				var menuBlock;
				try {
					menuBlock = page.menu;
					if (menuBlock) {
						context.paths[menuBlock.slug] = context.paths[menuBlock.slug] || {};
						context.paths[menuBlock.slug][page.slug] = 'page';
					}
					cb();
				} catch (err) {
					cb(err);
				}
			}, next);
		},
		categorizeSubPages: function (next) {
			async.each(context.subPages, function (subPage, cb) {
				var menuPage, menuBlock;
				try {
					menuPage = _.find(context.pages, function (page) {
						return subPage.page.menu.equals(page.menu._id);
					});
					menuBlock = menuPage.menu;
					if (menuBlock) {
						context.paths[menuBlock.slug] = context.paths[menuBlock.slug] || {};
						context.paths[menuBlock.slug][subPage.slug] = 'subpage';
					}
					cb();
				} catch (err) {
					cb(err);
				}
			}, next);
		},
		buildCompletePaths: function (next) {
			context.complete = _.flatten(_.map(context.paths, function (pages, menu) {
				return _.map(pages, function (pagetype, page) {
					return menu + '/' + page;
				});
			}));
			next();
		},
	},
		function done (err) {
			if (err) {
				return res.apiResponse({
					sucess: false,
					err: err,
				});
			} else {
				return res.apiResponse({
					success: true,
					data: {
						paths: context.paths,
						complete: context.complete,
					},
				});
			}
		});
};
