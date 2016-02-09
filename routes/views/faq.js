var keystone = require('keystone'),
	async = require('async'),
	_ = require('underscore');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res),
		locals = res.locals, navLink, label;
	
	locals.section = 'faq';
	
	// Find the nav link matching FAQ to look for a label
	navLink = _.find(locals.navLinks, function (nav) {
		return nav.key === locals.section;
	});
	label = navLink ? navLink.label : 'FAQ';

	locals.breadcrumbs = [{ label: label, path: '/faq' }];

	locals.data = {
		questionCategories: []
	};
	
	// Load Questions
	view.on('init', function (next) {

		keystone.list('Question').model
			.where('isActive', true)
			.sort('sortOrder')
			.populate('category')
			.exec(function (err, questions) {
				if (!err && questions) {
					questions.forEach(function (question) {
						var categories = locals.data.questionCategories,
							category = question.category,
							id = Number.isInteger(category.sortOrder) ? category.sortOrder : 0;
						categories[id] = categories[id] || [];
						categories[id].push(question);
					});
				}
				next(err);
			});
	});
	
	// Render the view
	view.render('faq');

};
