/**
 * This file contains the common middleware used by your routes.
 *
 * Extend or replace these functions as your application requires.
 *
 * This structure is not enforced, and just a starting point. If
 * you have more middleware you may want to group it as separate
 * modules in your project's /lib directory.
 */

var _ = require('underscore');
var	keystone = require('keystone');
var	async = require('async');

/**
	Initialises the standard view locals

	The included layout depends on the navLinks array to generate
	the navigation in the header, you may wish to change this array
	or replace it with your own templates / logic.
*/

exports.initLocals = function (req, res, next) {

	var locals = res.locals;
	var	context = {
		menu: [],
	};

	locals.navLinks = [];
	locals.user = req.user;
	locals.lastCommit = keystone.get('last commit');
	locals.brand = keystone.get('brand');
	locals.brandSafe = keystone.get('brand safe');
	locals.brandLong = keystone.get('brand long');
	locals.isPortal = keystone.get('is portal');
	locals.hasLogin = keystone.get('has login');
	locals.registerId = keystone.get('register id');
	locals.gaProperty = keystone.get('ga property front');
	locals.titleName = keystone.get('title name');
	locals.env = keystone.get('env');
	locals.registerLoggedIn = false;
	if (req.session && req.session.context && req.session.context.ContextID) {
		locals.context = req.session.context;
		try {
			locals.registerLoggedIn = locals.context.Unit.Register.RegisterID.toString() === locals.registerId;
		} catch (e) {
			console.log('Could not parse RegisterID for locals.registerLoggedIn');
		}

	}
	async.series({
		loadMenuBlocks: function (cb) {
			keystone.list('MenuBlock').model
				.find()
				// .populate('pages')
				.or([{ registerSpecific: { $ne: true } }, { registerSpecific: locals.registerLoggedIn }])
				.sort('sortOrder')
				.exec(function (err, menu) {
					if (!err) {
						context.menu = menu;
					}
					cb(err);
				});
		},
		// loadCategories: function(cb) {
		// 	keystone.list('ContentCategory').model
		// 		.find()
		// 		.populate('pages')
		// 		.sort('sortOrder')
		// 		.exec(function(err, categories) {
		// 			context.categories = categories;
		// 			cb(err);
		// 		});
		// },
		// loadPages: function(cb) {
		// 	context.pages = [];
		// 	async.each(context.categories, function(category, callback) {
		// 		keystone.list('Page').model
		// 			.find()
		// 			.where('category', category.id)
		// 			.where('state', 'published')
		// 			.sort('sortOrder')
		// 			.exec(function(err, pages) {
		// 				var innerLinks;
		// 				if (!pages || pages.length <= 0) {
		// 					callback(err);
		// 					return;
		// 				}
		// 				innerLinks = pages.map(function(page) {
		// 					return {
		// 						label: page.title,
		// 						key: category.slug + '/' + page.slug,
		// 						href: '/' + category.slug + '/' + page.slug
		// 					};
		// 				});
		// 				context.pages.push({
		// 					label: category.name,
		// 					key: category.slug,
		// 					href: (pages.length === 1 ? innerLinks[0].href : innerLinks),
		// 					isSubmenu: pages.length > 1,
		// 					sortOrder: category.sortOrder
		// 				});
		// 				callback(err);
		// 			});
		// 	}, cb);
		// },
		addCategoriesToNav: function (cb) {
			// locals.navLinks = locals.navLinks.concat(_.sortBy(context.pages, 'sortOrder'));

			// if(keystone.get('has login')){
				// locals.navLinks.push({
				// 	label: 'Registrering m.m.',
				// 	key: 'registration',
				// 	href: '/registrering'
				// });
			// }
			context.menu.forEach(function (menuBlock) {
				locals.navLinks.push({
					label: menuBlock.name,
					key: menuBlock.key,
					href: menuBlock.href, // menuBlock.static ? menuBlock.staticLink : ('/' + menuBlock.slug)
				});
			});
			cb();
		},
		// lookupBrandName: function(cb){
		// 	var StartPage = keystone.list('StartPage');
		// 	StartPage.model
		// 		.findOne(function(err, startPage){
		// 			if(startPage){
		// 				locals.brandName = startPage.header;
		// 			}
		// 			cb(err);
		// 		});
		// },
		getRegisterInformation: function (cb) {
			keystone.list('RegisterInformation').model
				.findOne(function (err, register) {
					if (register) {
						locals.brandName = register.name;
						locals.address = register.contactString;
						locals.email = register.email;
					}
					cb(err);
				});
		},
		getHostName: function (cb) {
			var host = req.headers.host;
			var	regEx = RegExp('(^' + keystone.get('brand') + '|^www)\.', 'i');
			locals.topHost = host.replace(regEx, '');
			locals.host = host;
			cb();
		},
	}, function (err) {
		if (err) {
			console.log(err);
		}
		next();
	});
};

exports.initErrorHandlers = function (req, res, next) {

	res.err = function (err, title, message) {
		res.status(500).render('errors/500', {
			layout: false,
			err: err,
			errorTitle: title,
			errorMsg: message,
		});
	};

	res.notFound = function (title, message) {
		res.status(404).render('errors/404', {
			layout: false,
			errorTitle: title,
			errorMsg: message,
		});
	};

	next();

};

/**
	Fetches and clears the flashMessages before a view is rendered
*/

exports.flashMessages = function (req, res, next) {

	var flashMessages = {
		info: req.flash('info'),
		success: req.flash('success'),
		warning: req.flash('warning'),
		error: req.flash('error'),
	};

	res.locals.messages = _.any(flashMessages, function (msgs) {
		return msgs.length;
	}) ? flashMessages : false;

	next();

};


/**
	Prevents people from accessing protected pages when they're not signed in
 */

exports.requireUser = function (req, res, next) {
	// console.log(req.user.canAccessProtected);
	if (!req.user || !req.user.canAccessProtected) {
		req.flash('error', 'Please sign in to access this page.');
		res.redirect('/keystone/signin');
	} else {
		next();
	}
};
