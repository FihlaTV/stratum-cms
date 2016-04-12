var keystone = require('keystone'),
	async = require('async'),
	_ = require('underscore');

exports = module.exports = function(req, res) {

	var view = new keystone.View(req, res),
		locals = res.locals, navLink, label;

	locals.section = locals.section || 'faq';

	// Find the nav link matching FAQ to look for a label
	navLink = _.find(locals.navLinks, function(nav) {
		return nav.key === locals.section;
	});
	label = navLink ? navLink.label : 'FAQ';

	locals.breadcrumbs = locals.breadcrumbs || [{ label: label, path: '/faq' }];

	locals.data = locals.data || {};
	locals.data.questionCategories = []
	locals.filters = locals.filters || {};
	locals.filters.questionCategories = locals.data.page && locals.data.page.questionCategories;

	// Load Questions
	view.on('init', function(next) {
		var query = keystone.list('Question').model
			.where('isActive', true)
			.sort('sortOrder')
			.populate('category');
		
		if(locals.filters.questionCategories){
			query.where({
				'category': {
					$in: locals.filters.questionCategories
				}
			});
		}
		
		query.exec(function(err, questions) {
			if (!err && questions) {
				questions.forEach(function(question) {
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
