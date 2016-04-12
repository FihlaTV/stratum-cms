var keystone = require('keystone'),
	_ = require('underscore'),
	importRoutes = keystone.importer(__dirname);

exports = module.exports = function(req, res) {
	var view = new keystone.View(req, res),
		locals = res.locals, context = {};

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
		shortid: req.params.shortid
	};
	
	/**
	 * Lookup current page from unique id 
	 */
	view.on('init', function(next) {
		keystone.list('BasePage').model
			.findOne()
			.where('shortId', locals.filters.shortid)
			.populate('page', 'shortId slug title menuTitle numberOfSubPages contacts menu questionCategories')
			.populate('widget')
			.exec(function(err, page) {
				if (!err) {
					if (!page) {
						res.notFound();
						return;
					}
					locals.data.widget = page.widget;
					locals.data.page = page;
					locals.data.menuPage = page.page || page;
					context.contentType = page.contentType;
					context.menuId = page.menu || page.page && page.page.menu;
				}
				next(err);
			});
	});
	
	/**	
	 * Current MenuBlock
	 * 
	 * Lookup the current menu block related to the page found from short id
	 */
	view.on('init', function(next) {
		keystone.list('MenuBlock').model
			.findOne()
			.where('_id', context.menuId)
			.exec(function(err, menu) {
				if (err) {
					next(err);
				} else if (!menu) {
					res.notFound();
				} else {
					locals.data.currentMenuBlock = menu;
					locals.section = menu.slug;
					next();
				}
			});
	});

	/**
	 * Pages in MenuBlocks
	 * 
	 * Lookup all pages which have a relation to the current menu block
	 * Store them in locals
	 */
	view.on('init', function(next) {
		keystone.list('Page').model
			.find()
			.where('menu', locals.data.currentMenuBlock._id)
			.sort('sortOrder')
			.select('slug title menuTitle shortId numberOfSubPages')
			.exec(function(err, pages) {
				if (!err) {
					locals.data.pages = pages;
                    if(pages.length <= 0){
						res.notFound();
                        return;                        
                    }
				}
				next(err);
			});
	});

	/**
	 * Breadcrumbs
	 * 
	 * Push all breadcrumbs to locals
	 */
	view.on('init', function(next){
		var menu = locals.data.currentMenuBlock;
		var menuPage = locals.data.menuPage;
		var page = locals.data.page;
		locals.breadcrumbs.push({
			label: menu.name,
			path: '/' + menu.slug
		});
		locals.breadcrumbs.push({
			label: menuPage.titleForMenu,
			path: '/' + locals.data.currentMenuBlock.slug + '/' + menuPage.slug + '/p/' + menuPage.shortId
		});
		if(page !== menuPage && page){
			locals.breadcrumbs.push({
				label: page.titleForMenu,
				path: '/' + locals.data.currentMenuBlock.slug + '/' + page.slug + '/p/' + page.shortId
			});
		}
		next();
	});

	/**
	 * SubPages
	 */
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

	/**
	 * ContentType
	 * If the type is other than default select a different view
	 */
	view.on('init', function(next){
		if(context.contentType && context.contentType !== 'default'){
			var contentViews = importRoutes('./content-types');
			var contentView = contentViews[context.contentType];
			if(!contentView){
				next(); //TODO: Error handling
				return;
			}
			// Redirect view to contentTypes view
			contentViews[context.contentType](req, res); 
		} else {
			next();
		}
	});
		
	/**
	 * Contacts
	 */
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

	/**
	 * Widget Settings
	 */
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
