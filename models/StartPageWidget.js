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
	linkType: { type: Types.Select, options: ['static', 'page'] },
	page: {
		type: Types.Relationship,
		ref: 'BasePage',
		index: true,
		dependsOn: { linkType: 'page' },
		note: 'Do not use, Not yet implemented!'
	},
	link: {
		type: Types.Url,
		dependsOn: { linkType: 'static' }
	}
});

StartPageWidget.defaultColumns = 'title, showOnStartPage|20%';
StartPageWidget.register();

