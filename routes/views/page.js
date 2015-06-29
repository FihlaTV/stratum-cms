var keystone = require('keystone');

exports = module.exports = function(req, res) {
	var view = new keystone.View(req, res),
		locals = res.locals;

	locals.section = req.params.page;
	locals.data = {
		currentMenuBlock: {},
		pages: [],
		page: {}
	};
	locals.filters = {
		menu: req.params.menublock,
		page: req.params.page
	};

	view.on('init', function(next){
		keystone.list('MenuBlock').model
			.findOne()
			.where('slug', locals.filters.menu)
			// .populate('pages')
			.exec(function(err, menu){
				if(!err && menu){
					locals.data.currentMenuBlock = menu;
					locals.section = menu.slug;
				}
				//if no menu send 404?
				next(err);
			});
	});

	view.on('init', function(next){
		keystone.list('Page').model
			.find()
			.where('menu', locals.data.currentMenuBlock._id)
			.sort('sortOrder')
			.select('slug title')
			.exec(function(err, pages){
				if(!err){
					locals.data.pages = pages;
				}
				next(err);
			});
	});

	view.on('init', function(next){
		var query = keystone.list('Page').model
			.findOne()
			.where('menu', locals.data.currentMenuBlock._id);
		if(locals.filters.page){
			query.where('slug', locals.filters.page);
		} else{
			query.sort('sortOrder');
		}
		query.exec(function(err, page){
			if(!err){
				locals.data.page = page;
			}
			next(err);
		});
	});

	view.render('page');
};
