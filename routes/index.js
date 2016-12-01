/**
 * This file is where you define your application routes and controllers.
 *
 * Start by including the middleware you want to run for every request;
 * you can attach middleware to the pre('routes') and pre('render') events.
 *
 * For simplicity, the default setup for route controllers is for each to be
 * in its own file, and we import all the files in the /routes/views directory.
 *
 * Each of these files is a route controller, and is responsible for all the
 * processing that needs to happen for the route (e.g. loading data, handling
 * form submissions, rendering the view template, etc).
 *
 * Bind each route pattern your application should respond to in the function
 * that is exported from this module, following the examples below.
 *
 * See the Express application routing documentation for more information:
 * http://expressjs.com/api.html#app.VERB
 */

var keystone = require('keystone');
var	middleware = require('./middleware');
var	importRoutes = keystone.importer(__dirname);
	// Webpack (dev only)
var	webpack = require('webpack');
var	webpackDevMiddleware = require('webpack-dev-middleware');
var	webpackHotMiddleware = require('webpack-hot-middleware');
var	webpackConfig = require('../webpack.config');


// Common Middleware
keystone.pre('routes', middleware.initLocals);
keystone.pre('routes', middleware.initErrorHandlers);
keystone.pre('render', middleware.flashMessages);

// Handle 404 errors
keystone.set('404', function (req, res, next) {
	res.notFound();
});

// Handle other errors
keystone.set('500', function (err, req, res, next) {
	var title;
	var message;

	if (err instanceof Error) {
		message = err.message;
		err = err.stack;
	}
	res.err(err, title, message);
});

// Import Route Controllers
var routes = {
	api: importRoutes('./api'),
	views: importRoutes('./views'),
	proxies: importRoutes('./proxies'),
	contentTypes: importRoutes('./views/content-types'),
};

// Setup webpack compiler

// Setup Route Bindings
exports = module.exports = function (app) {
	// Proxies
	app.all('/stratum/*', routes.proxies.stratum);

	// Activate webpack hot reload middleware
	if (keystone.get('env') === 'development') {
		var compiler = webpack(webpackConfig);
		app.use(webpackDevMiddleware(compiler, { noInfo: true, publicPath: webpackConfig.output.publicPath }));
		app.use(webpackHotMiddleware(compiler));
	}

	// API
	app.all('/api*', keystone.middleware.api);
	app.all('/api/pages', routes.api.pages);
	app.all('/api/authentication/login', routes.api['stratum-login']);
	app.all('/api/authentication/context', routes.api['stratum-login']);
	app.all('/api/sub-page-count', routes.api['sub-page-count']);
	app.get('/api/news', routes.api.news);
	app.get('/api/news/:newsItem/', routes.api.newsItem);
	app.get('/api/questions', routes.api.faq);
	app.get('/api/questions/category/:questionCategory', routes.api.faq);

	// Allow cross domain calls for messages
	app.get('/api/messages', keystone.middleware.cors);
	app.get('/api/messages', routes.api.messages);

	// Menu
	app.get('/api/menu', routes.api.menu);

	// Page
	app.get('/api/pages/:id', routes.api.page);

	// Start Page
	app.get('/api/start-page', routes.api['start-page']);

	// Register information
	app.get('/api/register-information', routes.api['register-information']);

	// API calls for refreshing metadata
	app.all('/api/refresh/stratum-widgets', routes.api['stratum-widgets']);
	app.all('/api/refresh/stratum-registers', routes.api['stratum-registers']);
	app.all('/api/refresh/keystone-widgets', routes.api['keystone-widgets']);

	// Restrict all pages to logged in users for now...
	if (keystone.get('protect all pages')) {
		app.get('/*', middleware.requireUser);
	}

	// Views
	app.get('/', routes.views.index);

	app.get('/nyheter', routes.views.news);
	app.get('/nyheter/:newsitem/', routes.views.newsitem);
	app.get('/registrering', routes.views.registration);
	app.get('/faq', routes.contentTypes.faq);
	// app.get('/kontakt', routes.views.contact);

	// Logout
	app.get('/logout', routes.views.logout);

	app.get('/react/*', routes.views.react);
  // Views for dynamic routes
	app.get('/:menublock/', routes.views.menublock);
	app.get('*/p/:shortid', routes.views.page);
};
