var keystone = require('keystone');
var async = require('async');

exports = module.exports = function(req, res) {

	var view = new keystone.View(req, res),
		locals = res.locals;

	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'home';
	locals.data = {
		news: [],
		widgets: []
	};

	//Load Start Page settings
	view.on('init', function(next) {
		keystone.list('StartPage').model
			.findOne()
			.populate('informationBlurb.newsItem quickLink.page')
			.exec(function(err, startPage) {
				if (!err && startPage) {
					locals.data.startPage = startPage;
				}
				next(err);
			});
	});

	//Load StartPageWidgets
	view.on('init', function(next) {
		keystone.list('StartPageWidget').model
			.find()
			.sort('sortOrder')
			.limit(8)
			.populate('widget')
			.populate('page', 'slug shortId')
			.exec(function(err, widgets) {
				if (!err) {
					locals.data.startPageWidgets = widgets;
				}
				next(err);
			});
	});

	// Populate StartPageWidgets with dynamic Widgets
	view.on('init', function(next) {
		var startPageWidgets = locals.data.startPageWidgets;
		async.each(startPageWidgets, function(widget, cb) {
			// Only works with KeystoneWidget for now
			if (widget.useWidget && 
				widget.widget && widget.widget.type === 'keystone') {
				if(widget.linkType === 'page' && widget.page){
					widget.link = widget.page.directPath;
				}
				keystone.list('KeystoneWidget').model
					.findOne()
					.where('_id', widget.widget.keystoneWidget)
					.exec(function(err, kWidget) {
						if (!err) {
							widget.keystoneWidget = kWidget;
						}
						cb(err);
					});
			} else {
				cb();
			}
		}, next);
	});

	// Load the 3 latest news items
	view.on('init', function(next) {
		keystone.list('NewsItem').model
			.find()
			.where('state', 'published')
			.where('publishedDate', {
				$exists: true
			})
			.sort('-publishedDate')
			.limit(3)
			.populate('author')
			.exec(function(err, news) {
				if (!err) {
					locals.data.news = news;
					locals.data.firstNews = news && news.length > 0 && locals.data.news[0];
				}
				next(err);
			});
	});
	
	// Load Sub Registers 
	view.on('init', function(next){
		if(!keystone.get('is portal')){
			next();
			return;
		}
		keystone.list('SubRegister').model
			.find()
			.sort('sortOrder')
			.exec(function(err, registers){
				if(!err){
					locals.data.subRegisters = registers;
				}
				next(err);
			});
	});

	// Render the view
	view.render('index');
};
