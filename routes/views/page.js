var keystone = require('keystone'),
	_ = require('underscore');

exports = module.exports = function(req, res) {
	var view = new keystone.View(req, res),
		locals = res.locals;

	locals.stratumServer = keystone.get('stratum server');
	locals.breadcrumbs = [];
	locals.widget = {};
	locals.section = req.params.page;
	locals.data = {
		currentMenuBlock: {},
		pages: [],
		page: {},
		menuPage: {},
		subPages: []
	};
	locals.filters = {
		menu: req.params.menublock, //undefined bug
		page: req.params.page
	};

	//Current menu block
	view.on('init', function(next) {
		keystone.list('MenuBlock').model
			.findOne()
			.where('slug', locals.filters.menu)
			.exec(function(err, menu) {
				if (err) {
					next(err);
				} else if (!menu) {
					res.status(404).send('Not found');
				} else {
					locals.data.currentMenuBlock = menu;
					locals.section = menu.slug;
					locals.breadcrumbs.push({
						label: menu.name,
						path: '/' + menu.slug
					});
					next();
				}
			});
	});

	//Pages in menu block
	view.on('init', function(next) {
		keystone.list('Page').model
			.find()
			.where('menu', locals.data.currentMenuBlock._id)
			.sort('sortOrder')
			.select('slug title menuTitle numberOfSubPages')
			.exec(function(err, pages) {
				if (!err) {
					locals.data.pages = pages;
				}
				next(err);
			});
	});

	//Current page
	view.on('init', function(next) {
		var query = keystone.list('BasePage').model
			.findOne();
		if (locals.filters.page) {
			query.where('slug', locals.filters.page)
				.or([{
					'menu': locals.data.currentMenuBlock._id
				}, {
					'page': { //check for sub pages
						'$in': _.pluck(locals.data.pages, '_id')
					}
				}]);
		} else {
			query.where('menu', locals.data.currentMenuBlock._id)
				.sort('sortOrder');
		}
		query
			.populate('page', 'slug title numberOfSubPages contacts')
			.populate('widget')
			.exec(function(err, page) {
				if (!err) {
					if (!page) {
						res.redirect('/' + locals.filters.menu);
						return;
					}
					locals.data.widget = page.widget;
					locals.data.page = page;
					locals.data.menuPage = page.page || page;
					if (page.page) {
						locals.breadcrumbs.push({
							label: page.page.title,
							path: '/' + locals.data.currentMenuBlock.slug + '/' + page.page.slug
						});
					}
					locals.breadcrumbs.push({
						label: page.title,
						path: '/' + locals.data.currentMenuBlock.slug + '/' + page.slug
					});
				}
				next(err);
			});
	});

	//Sub pages
	view.on('init', function(next) {
		if (!locals.data.page) {
			next();
			return;
		}
		keystone.list('SubPage').model
			.find()
			.where('page', locals.data.menuPage._id)
			.sort('sortOrder')
			.exec(function(err, subPages) {
				if (!err) {
					locals.data.subPages = subPages;
				}
				next(err);
			});
	});

	//Contacts
	view.on('init', function(next) {
		if (!locals.data.page || !locals.data.page.contacts) {
			next();
			return;
		}
		keystone.list('Contact').model
			.find()
			.where('_id')
			.in(locals.data.page.contacts)
			.sort('sortOrder')
			.exec(function(err, contacts) {
				if (!err) {
					locals.data.contacts = contacts;
				}
				next(err);
			});
	});

	//Load widget settings
	view.on('init', function(next) {
		var widget = locals.data.widget;
		switch (widget && widget.getValue('type')) {
			case 'keystone':
				keystone.list('KeystoneWidget').model
					.findOne({
						'_id': widget.get('keystoneWidget')
					})
					.exec(function(err, kWidget) {
						if (!err) {
                            locals.keystoneWidget = kWidget;
						}
						next(err);
					});
				break;
			case 'stratum':
				keystone.list('StratumWidget').model
					.findOne({
						'_id': widget.get('stratumWidget')
					})
					.exec(function(err, sWidget) {
						if (sWidget) {
							locals.stratumWidget = sWidget;
						}
						next(err);
					});
				break;
			default:
				next();
		}
	});

	view.render('page');
};
