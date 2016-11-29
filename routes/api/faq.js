var keystone = require('keystone');

exports = module.exports = function (req, res) {
	var query = keystone.list('Question').model
		.where('isActive', true)
		.sort('sortOrder')
		.populate('category');


	if (req.params.questionCategory) {
		query.where({
			category: {
				$in: req.params.questionCategory.split(','),
			},
		});
	}
	query.exec(function (err, questions) {
		if (err) {
			return res.apiResponse({
				success: false,
				error: err,
			});
		}
		var categories = [];
		questions.forEach(function (question) {
			var	category = question.category;
			if (category) {
				var id = Number.isInteger(category.sortOrder) ? category.sortOrder : 0;
				categories[id] = categories[id] || {
					category: category.category,
					questions: [],
				};
				var qAndA = { question: question.question, answer: question.answer.html };
				categories[id].questions.push(qAndA);
			}
		});
		var cleanCategories = categories.filter(function (category) {
			return category !== null;
		});
		return res.apiResponse({
			success: true,
			data: cleanCategories,
		});
	});
	/* if (locals.filters.questionCategories) {
		query.where({
			category: {
				$in: locals.filters.questionCategories,
			},
		});
	} */

};
