var keystone = require('keystone');
var	Types = keystone.Field.Types;

/**
 * StartPageWidget Model
 * ==========
 */

var StartPageWidget = new keystone.List('StartPageWidget', {
	sortable: true,
	track: { createdAt: true, updatedAt: true, updatedBy: true },
	autokey: { path: 'slug', from: 'name', unique: true },
});

StartPageWidget.add({
	name: { type: String, required: true },
	showOnStartPage: {
		type: Boolean,
		note: 'Check here if this widget should be visible on the start page',
	},
	useWidget: { type: Boolean },
	digit: { type: String, dependsOn: { useWidget: false } },
	widget: {
		type: Types.Relationship,
		ref: 'Widget',
		filters: { // only works with keystone widgets for now
			type: 'keystone',
		},
		dependsOn: { useWidget: true },
		many: false,
	},
	description: { type: Types.Textarea },
	linkType: { type: Types.Select, options: ['static', 'page'] },
	linkText: { type: String, default: 'Se mer statistik', dependsOn: {
		linkType: ['static', 'page'],
	} },
	page: {
		type: Types.Relationship,
		ref: 'BasePage',
		index: true,
		dependsOn: { linkType: 'page' },
	},
	link: {
		type: Types.Url,
		dependsOn: { linkType: 'static' },
	},
});

StartPageWidget.defaultColumns = 'name, useWidget, showOnStartPage';
StartPageWidget.register();

