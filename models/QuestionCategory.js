var keystone = require('keystone'),
	Types = keystone.Field.Types;

/**
 * QuestionCategory Model
 * ==========
 */

var QuestionCategory = new keystone.List('QuestionCategory', {
	map: { name: 'category' }
});

QuestionCategory.add({
	category: { type: String, required: true, index: true, initial: true }
});

QuestionCategory.relationship({
	path: 'questions',
	ref: 'Question',
	refPath: 'category'
});

QuestionCategory.register();
