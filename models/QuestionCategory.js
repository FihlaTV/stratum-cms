var keystone = require('keystone');

/**
 * QuestionCategory Model
 * ==========
 */

var QuestionCategory = new keystone.List('QuestionCategory', {
	map: { name: 'category' },
	track: { createdAt: true, updatedAt: true, updatedBy: true },
	sortable: true,
});

QuestionCategory.add({
	category: { type: String, required: true, index: true, initial: true },
});

QuestionCategory.relationship({
	path: 'questions',
	ref: 'Question',
	refPath: 'category',
});

QuestionCategory.register();
