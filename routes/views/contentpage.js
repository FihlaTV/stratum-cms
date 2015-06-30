var keystone = require('keystone');

exports = module.exports = function(req, res) {

	var view = new keystone.View(req, res),
		locals = res.locals;

	locals.section = req.params.contentpage;
	locals.data = {
		contentpage: {}
	};
	locals.filters = {
		page: req.params.contentpage
	};

	// Render the view
	// view.render('gallery');

	//Find current contentpage
	view.on('init', function(next) {

		keystone.list('ContentPage').model
		.findOne({
			state: 'published',
			slug: locals.filters.page
		})
		.populate('widget menu')
		.exec(function(err, result) {
			locals.data.contentpage = result;
			next(err);
		});

	});

	//Find content pages in same category (for rendering the side menu)
	view.on('init', function(next){
		var menuBlockId;
		if(!locals.data.contentpage){
			next('missing contentpage');
			return;
		}
		menuBlockId = locals.data.contentpage.menu;
		keystone.list('ContentPage').model
			.find()
			.where('menu', menuBlockId)
			.where('state', 'published')
			.sort('sortOrder')		
			.exec(function(err, pages) {
				if(!err && pages.length > 1){
					locals.data.contentpages = pages;
				}
				next(err);
			});
	});

	view.render('contentpage');
};
