var keystone = require('keystone'),
	Types = keystone.Field.Types;

/**
 * StartPageWidget Model
 * ==========
 */

var StartPageWidget = new keystone.List('StartPageWidget', {
	sortable: true,
	autokey: { path: 'slug', from: 'name', unique: true }
});

StartPageWidget.add({
	name: { type: String, required: true },
	digit: { type: String },
	showOnStartPage: { type: Boolean },
	description: { type: Types.Textarea },
	page: { type: Types.Relationship, ref: 'BasePage', index: true }
});

// StartPageWidget.defaultColumns = 'title, state|20%, author|20%, publishedDate|20%';
StartPageWidget.register();
