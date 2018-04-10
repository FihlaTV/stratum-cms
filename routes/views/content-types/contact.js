var keystone = require('keystone');

exports = module.exports = function(req, res) {
	var view = new keystone.View(req, res);
	var locals = res.locals;

	// Set locals
	locals.section = locals.section || 'contact';
	locals.breadcrumbs = locals.breadcrumbs || [
		{ label: 'Kontakt', path: '/kontakt' },
	];
	locals.googleApiKey = keystone.get('google api key'); // Should probably be placed globally...

	view.on('init', function(next) {
		view.query(
			'contacts',
			keystone
				.list('Contact')
				.model.find()
				.where('showOnContactPage', true)
				.sort({ 'name.last': 1, 'name.first': 1 })
		);

		next();
	});

	view.on('init', function(next) {
		view.query(
			'register',
			keystone
				.list('RegisterInformation')
				.model.findOne()
				.populate('subRegisters')
		);
		next();
	});

	view.render('contact');
};
