/**
 * Lightweight sever for handling global messages
 * ==============================================
 * Removes all functionality from the regular sytem
 * except for Message and User models and api call
 * for requesting messages.
 */
require('dotenv').load();

var keystone = require('keystone');

keystone.init({
	name: process.env.MESSAGE_SERVER_NAME || 'Message Server',
	brand: process.env.MESSAGE_SERVER_BRAND || 'Message Server',
	updates: 'updates/message-server',
	'auto update': true,
	mongo:
		process.env.MESSAGE_SERVER_MONGO_URI ||
		'mongodb://localhost/message-server',
	'is message server': true,
	session: true,
	'session store': 'mongo',
	auth: true,
	'user model': 'User',
	'cookie secret': process.env.MESSAGE_SERVER_COOKIE_SECRET || 'stratum-cms',
	'cors allow origin': true,
	'default region': 'SE',
});

// Load Models

require('./models/User');
require('./models/Message');

// Load Routes

var messageRoute = require('./routes/api/messages.js');

keystone.set('routes', function(app) {
	app.all('/*', keystone.middleware.api);
	// Allow cross domain calls for messages
	app.get('/messages', keystone.middleware.cors);
	app.get('/messages', messageRoute);
});

var nav = {
	users: 'users',
	messages: 'messages',
};

keystone.set('nav', nav);

// Output environment variable
console.log('Currently running messages only server in ' + keystone.get('env'));

keystone.start();
