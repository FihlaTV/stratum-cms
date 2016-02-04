var keystone = require('keystone'),
	async = require('async');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res),
		locals = res.locals;
	
	// Init locals
	locals.section = 'news';
	locals.breadcrumbs = [{ label: 'Frågor och svar', path: '/faq' }];
	// locals.pageScripts = [{src: 'views/news.js'}];

	// locals.filters = {
	// 	category: req.params.category
	// };
	locals.data = {
		questionCategories: {}//,
		// categories: []
	};
	
	// Load news
	view.on('init', function (next) {

		keystone.list('Question').model
			.where('isActive', true)
			.sort('-sortOrder')
			.populate('category')
			.exec(function (err, questions) {
				if (!err && questions) {
					questions.forEach(function (question) {
						var categories = locals.data.questionCategories,
							id = question.category._id;
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
