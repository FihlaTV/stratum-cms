var keystone = require('keystone');

exports = module.exports = function(req, res) {

	var view = new keystone.View(req, res),
		locals = res.locals;

	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'home';
	locals.data = {
		news: [],
		newsWithImage: [],
		widgets: []
	};

	//Load Start Page settings
	view.on('init', function(next){
		var StartPage = keystone.list('StartPage').model;
		StartPage.findOne(function(err, startPage){
			if(!err && startPage){
				locals.data.startPage = startPage;
			}
			next(err);
		});
	});

	//Load Register Information
	view.on('init', function(next){
		var RegisterInformation = keystone.list('RegisterInformation').model;
		RegisterInformation
			.findOne()
			.populate('subRegisters')
			.exec(function(err, register){
			if(!err && register){
				locals.data.register = register;
			}
			next(err);
		});
	});


	//Load start page widgets
	view.on('init', function(next){
		var Widget = keystone.list('Widget').model;
		Widget.find()
			.where('showOnStartPage', true)
			.sort('sortOrder')
			.limit(10)
			.populate('stratumWidget')
			.exec(function(err, widgets){
				locals.data.widgets = widgets;
				next(err);
			});
	});

	// Load the 10 newest news items
	view.on('init', function(next) {
		var q = keystone.list('NewsItem').model.find({
			state: 'published'
		})
		.sort('-publishedDate')
		.limit(10)
		.populate('author categories');
		
		q.exec(function(err, result) {
			locals.data.news = result;
			next(err);
		});
	}); 

	// Load news with images
	view.on('init', function(next) {
		keystone.list('NewsItem').model.find({
				state: 'published'
			})
			.exists('image')
			.sort('-publishedDate')
			.limit(3)
			.exec(function(err, result) {
				if(!err){
					locals.data.newsWithImage = result.filter(function(newsItem){
						return newsItem.image.exists;
					});
				}
				next(err);
			});
	});

	// Render the view
	view.render('index');

};
