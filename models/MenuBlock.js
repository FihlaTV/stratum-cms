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
	},
	static: {
		type: Boolean,
		note: 'Check this if this menu item should link to a specific URL'
	},
	staticLink: {
		type: Types.Url,
		dependsOn: {
			static: true
		}
	},
	key: {
		type: String,
		collapse: true,
		dependsOn: {
			static: true
		}
	}
});
MenuBlock.relationship({
	path: 'pages',
	ref: 'Page',
	refPath: 'menu'
});

MenuBlock.register();
