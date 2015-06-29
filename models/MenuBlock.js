var keystone = require('keystone'),
	Types = keystone.Field.Types;

/**
 * Menu Block Model
 * ==========
 */

var MenuBlock = new keystone.List('MenuBlock', {
	sortable: true,
	autokey: {
		from: 'name',
		path: 'slug',
		unique: true
	}
});

MenuBlock.add({
	name: {
		type: String,
		required: true
	},
	description: {
		type: Types.Textarea,
		height: 150
	},
	registerSpecific: {
		type: Boolean,
		note: 'Only visible to logged in users'
	}
});
MenuBlock.relationship({
	path: 'pages',
	ref: 'Page',
	refPath: 'menu'
});

MenuBlock.register();
