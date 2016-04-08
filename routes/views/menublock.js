var keystone = require('keystone'),
	_ = require('underscore'),
	importRoutes = keystone.importer(__dirname);

exports = module.exports = function(req, res) {
	var view = new keystone.View(req, res),
		locals = res.locals, context = {};
		
	/**
	 * Look for menu blocks matching parameter
	 */
	view.on('init', function(next) {
		keystone.list('MenuBlock').model
			.findOne()
			.where('slug', req.params.menublock)
			.where('static', false)
			.exec(function(err, menu) {
				if (err) {
					next(err);
				} else if (!menu) {
					res.status(404).send('Not found');
					return;
				} else {
					context.menu = menu;
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
			.where('menu', context.menu._id)
			.sort('sortOrder')
			.exec(function(err, page) {
				if (!err) {
                    if(!page){
                        res.status(404).send('Not found');
                    } else {
						res.redirect('/' + context.menu.slug + '/' + page.slug + '/p/' + page.shortId);
					}
				} else {
					res.status(500).send('error');
				}
			});
	});
	
	view.render('page');
};
