var keystone = require('keystone'),
	_ = require('underscore'),
	importRoutes = keystone.importer(__dirname);

exports = module.exports = function(req, res) {
	var view = new keystone.View(req, res),
		locals = res.locals, context = {};

	locals.breadcrumbs = [];
	locals.data = {
		currentMenuBlock: {},
		page: {},
	};
	locals.filters = {
		menu: req.params.menublock
	};
		
	/**
	 * Look for menu blocks matching parameter
	 */
	view.on('init', function(next) {
		keystone.list('MenuBlock').model
			.findOne()
			.where('slug', locals.filters.menu)
			.where('static', false)
			.exec(function(err, menu) {
				if (err) {
					next(err);
				} else if (!menu) {
					res.status(404).send('Not found');
					return;
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

	/**
	 * Find first page in menu block and redirect to found page 
	 */
	view.on('init', function(next) {
		keystone.list('Page').model
			.findOne()
			.where('menu', locals.data.currentMenuBlock._id)
			.sort('sortOrder')
			.exec(function(err, page) {
				if (!err) {
					locals.data.page = page;
                    if(!page){
                        res.status(404).send('Not found');
                    } else {
						res.redirect('/' + locals.data.currentMenuBlock.slug + '/' + page.slug + '/p/' + page.shortId);
					}
				} else {
					res.status(500).send('error');
				}
			});
	});
	
	view.render('page');
};
