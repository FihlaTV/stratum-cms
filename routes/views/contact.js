var keystone = require('keystone'),
	Enquiry = keystone.list('Enquiry');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res),
		locals = res.locals;
	
	// Set locals
	locals.section = 'contact';

	view.on('init', function(next){
		view.query('users', keystone.list('User').model
			.find()
			.where('showOnContactPage', true)
			.sort({'name.last': 1, 'name.first': 1}));

		next();
	});
	view.render('contact');
	
};
