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
		newsWithImage: [],
		widgets: []
	};

	//Load Start Page settings
	view.on('init', function(next) {
		keystone.list('StartPage').model
			.findOne(function(err, startPage) {
				if (!err && startPage) {
					locals.data.startPage = startPage;
				}
				next(err);
			});
	});

	//Load Register Information
	view.on('init', function(next) {
		keystone.list('RegisterInformation').model
			.findOne()
			.populate('subRegisters')
			.exec(function(err, register) {
				if (!err && register) {
					locals.data.register = register;
				}
				next(err);
			});
	});


	//Load start page widgets
	view.on('init', function(next) {
		keystone.list('Widget').model
			.find()
			.where('showOnStartPage', true)
			.sort('sortOrder')
			.limit(10)
			.populate('stratumWidget')
			.exec(function(err, widgets) {
				if (!err) {
					locals.data.widgets = widgets;
				}
				next(err);
			});
	});

	//Load static widgets
	view.on('init', function(next) {
		keystone.list('StartPageWidget').model
			.find()
			.where('showOnStartPage', true)
			.sort('sortOrder')
			.limit(8)
			.populate('widget')
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
			.find({
				state: 'published'
			})
			.sort('-publishedDate')
			.limit(3)
			.populate('author categories')
			.exec(function(err, news) {
				if (!err) {
					locals.data.news = news;
					locals.data.firstNews = news && news.length > 0 && locals.data.news[0];
				}
				next(err);
			});
	});

	// Load the latest 3 news items containing images
	view.on('init', function(next) {
		keystone.list('NewsItem').model.find({
				state: 'published'
			})
			.exists('image')
			.sort('-publishedDate')
			.limit(3)
			.exec(function(err, news) {
				if (!err) {
					locals.data.newsWithImage = news.filter(function(newsItem) {
						return newsItem.image.exists;
					});
				}
				next(err);
			});
	});

	// Render the view
	view.render('index');

};
