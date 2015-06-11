// Simulate config options from your production environment by
// customising the .env file in your project's root folder.
require('dotenv').load();

// Require keystone
var keystone = require('keystone'),
	handlebars = require('express-handlebars'),
	fs = require('fs'),
	stratum = require('./utils/stratum'),
	Helpers = require('./templates/views/helpers');

// Initialise Keystone with your project's configuration.
// See http://keystonejs.com/guide/config for available options
// and documentation.

keystone.init({

	'name': 'Test Keystone',
	'brand': 'Test Keystone',
	'wysiwyg cloudinary images': true,
	'less': 'public',
	'static': 'public',
	'favicon': 'public/favicon.ico',
	'views': 'templates/views',
	'view engine': 'hbs',
	'default region': 'SE',
	'custom engine': handlebars.create({
		layoutsDir: 'templates/views/layouts',
		partialsDir: 'templates/views/partials',
		defaultLayout: 'default',
		helpers: new Helpers(),
		extname: '.hbs'
	}).engine,
	
	'auto update': true,
	'session': true,
	'auth': true,
	'user model': 'User',
	'cookie secret': process.env.COOKIE_SECRET || 'stratum-cms',
	'protect all pages': process.env.PROTECT_ALL_PAGES === 'true',
	'stratum api key': process.env.STRATUM_API_KEY

});

// Load your project's Models

keystone.import('models');

stratum.loadWidgets(); 
stratum.loadRegisters();

// Setup common locals for your templates. The following are required for the
// bundled templates and layouts. Any runtime locals (that should be set uniquely
// for each request) should be added to ./routes/middleware.js

keystone.set('locals', {
	_: require('underscore'),
	env: keystone.get('env'),
	utils: keystone.utils,
	editable: keystone.content.editable
});

if(keystone.get('env') === 'development' && fs.existsSync('last_commit.json')){
	try{
		keystone.set('last commit', JSON.parse(fs.readFileSync('last_commit.json', 'utf8')));
	} catch(e){
		console.log(e);
	}
}
// Load your project's Routes

keystone.set('routes', require('./routes'));

// Setup common locals for your emails. The following are required by Keystone's
// default email templates, you may remove them if you're using your own.

// Configure the navigation bar in Keystone's Admin UI
 
keystone.set('nav', {
	'content': ['content-pages', 'content-categories'],
	'start-pages': 'start-pages',
	'register-information': 'register-information',
	'news': 'news-items',
	// 'posts': ['posts', 'post-categories'],
	// 'galleries': 'galleries',
	// 'enquiries': 'enquiries',
	'users': 'users',
	'widgets': 'widgets'
});

// Start Keystone to connect to your database and initialise the web server

keystone.start();
