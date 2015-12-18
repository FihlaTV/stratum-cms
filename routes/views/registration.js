var keystone = require('keystone');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res),
		locals = res.locals;
	
	// Set locals
	locals.section = 'registration';
	locals.breadcrumbs = [{label: 'Registrering', path: '/registrering'}];
	//locals.googleApiKey = keystone.get('google api key');

	view.render('registration');
};
