var keystone = require('keystone'),
	Types = keystone.Field.Types;

/**
 * Question Model
 * ==========
 */

var Question = new keystone.List('Question', {
	map: { name: 'question' },
	sortable: true
});

Question.add({
	question: { type: String, required: true, index: true, initial: true },
	answer: {
		type: Types.Markdown,
		required: true,
		initial: true,
		toolbarOptions: { hiddenButtons: 'Image,Quote,Code,H1,H2,H3,H4,H5,H6' }
	},
	category: {
		type: Types.Relationship,
		ref: 'QuestionCategory',
		required: true,
		initial: true
	},
	isActive: { type: Boolean, default: true }
});

Question.defaultColumns = 'question, category';
Question.register();
