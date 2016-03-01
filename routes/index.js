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

var keystone = require('keystone'),
	middleware = require('./middleware'),
	importRoutes = keystone.importer(__dirname),
	//Webpack (dev only)
	webpack = require('webpack'),
	webpackDevMiddleware = require('webpack-dev-middleware'),
	webpackHotMiddleware = require('webpack-hot-middleware'),
	webpackConfig = require('../webpack.config');
	


// Common Middleware
keystone.pre('routes', middleware.mapContextId);
keystone.pre('routes', middleware.initLocals);
keystone.pre('render', middleware.flashMessages);

// Import Route Controllers
var routes = {
	api: importRoutes('./api'),
	views: importRoutes('./views'),
	proxies: importRoutes('./proxies')
};

// Setup webpack compiler

// Setup Route Bindings
exports = module.exports = function(app) {
	// Proxies
	app.all('/stratum/*', routes.proxies.stratum);

	//Activate webpack hot reload middleware
	if(keystone.get('env') === 'development'){
        var compiler = webpack(webpackConfig);
		app.use(webpackDevMiddleware(compiler, { noInfo: true, publicPath: webpackConfig.output.publicPath }));
		app.use(webpackHotMiddleware(compiler));
	}

	// API
	app.all('/api*', keystone.middleware.api);
	app.all('/api/stratum-widgets', routes.api['stratum-widgets']);
	app.all('/api/stratum-registers', routes.api['stratum-registers']);
	app.all('/api/pages', routes.api.pages);
	app.all('/api/load-widgets', routes.api['load-widgets']);
	app.all('/api/authentication/login', routes.api['stratum-login']);
	app.all('/api/sub-page-count', routes.api['sub-page-count']);

	// Restrict all pages to logged in users for now...
	if (keystone.get('protect all pages')) {
		app.get('/*', middleware.requireUser);
	}

	// Views
	app.get('/', routes.views.index);

	app.get('/nyheter', routes.views.news);
	app.get('/nyheter/:newsitem/', routes.views.newsitem);
	app.get('/registrering', routes.views.registration);
	app.get('/faq', routes.views.faq);
	// app.get('/kontakt', routes.views.contact);

	// Logout
	app.get('/logout', routes.views.logout);
	
	// Views for dynamic routes
	app.get('/:menublock?', routes.views.page);
	app.get('/:menublock?/:page', routes.views.page);
};
