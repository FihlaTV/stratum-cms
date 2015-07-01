var keystone = require('keystone'),
	_ = require('underscore');

exports = module.exports = function(req, res) {
	var view = new keystone.View(req, res),
		locals = res.locals;

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
			// .populate('pages')
			.exec(function(err, menu) {
				if (err) {
					next(err);
				} else if (!menu) {
					res.status(404).send('Not found');
				} else {
					locals.data.currentMenuBlock = menu;
					locals.section = menu.slug;
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
			.select('slug title')
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
			.populate('page', 'slug title')
			.exec(function(err, page) {
				if (!err) {
					if (!page) {
						res.redirect('/' + locals.filters.menu);
						return;
					}
					locals.data.page = page;
					locals.data.menuPage = page.page || page;
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

	view.render('page');
};
