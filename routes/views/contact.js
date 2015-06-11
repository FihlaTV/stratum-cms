var keystone = require('keystone');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res),
		locals = res.locals;
	
	// Set locals
	locals.section = 'contact';
	locals.googleApiKey = keystone.get('google api key');

	view.on('init', function(next){
		view.query('users', keystone.list('User').model
			.find()
			.where('showOnContactPage', true)
			.sort({'name.last': 1, 'name.first': 1}));

		next();
	});

	view.on('init', function(next){
		view.query('register', keystone.list('RegisterInformation').model
			.findOne()
			.populate('subRegisters'));
		next();
	});

	view.render('contact');
	
};
