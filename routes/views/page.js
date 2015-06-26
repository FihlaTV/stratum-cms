var keystone = require('keystone');

exports = module.exports = function(req, res) {
	var view = new keystone.View(req, res),
		locals = res.locals;

	locals.section = req.params.page;
	locals.data = {
		page: {},
		currentMenuBlock: {}
	};
	locals.filters = {
		menu: req.params.menublock,
		page: req.params.page
	};

	view.on('init', function(next){
		keystone.list('MenuBlock').model
			.findOne()
			.where('slug', locals.filters.menu)
			.populate('pages')
			.exec(function(err, menu){
				if(!err){
					locals.data.currentMenuBlock = menu;
				}
				//if no menu send 404?
				next(err);
			});
	});

	view.on('init', function(next){
		if(locals.filters.page){
			// debugger;
		}
		next();
	});
	// //Find current page
	// view.on('init', function(next) {

	// 	keystone.list('Page').model
	// 	.findOne(locals.filters.page ? {
	// 		state: 'published',
	// 		slug: locals.filters.page
	// 	} : {
	// 		state: 'published'
	// 	})
	// 	.populate('menu')
	// 	.exec(function(err, result) {
	// 		locals.data.page = result;
	// 		next(err);
	// 	});

	// });

	//Find content pages in same category (for rendering the side menu)
	// view.on('init', function(next){
	// 	var menuBlockId;
	// 	if(!locals.data.page){
	// 		next('missing page');
	// 		return;
	// 	}
	// 	menuBlockId = locals.data.page.menu;
	// 	keystone.list('Page').model
	// 		.find()
	// 		.where('menu', menuBlockId)
	// 		.where('state', 'published')
	// 		.sort('sortOrder')		
	// 		.exec(function(err, pages) {
	// 			if(!err && pages.length > 1){
	// 				locals.data.pages = pages;
	// 			}
	// 			next(err);
	// 		});
	// });

	view.render('page');
};
