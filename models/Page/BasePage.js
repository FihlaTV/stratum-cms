var keystone = require('keystone'),
	Types = keystone.Field.Types;

/**
 * Base Page Model
 * ==========
 */

var BasePage = new keystone.List('BasePage', {
	sortable: true,
	map: {
		name: 'title'
	},
	autokey: {
		path: 'slug',
		from: 'title',
		unique: true
	},
	nocreate: true,
	nodelete: true,
	hidden: true
});

BasePage.add({
	title: {
		type: String,
		required: true
	},
	subtitle: {
		type: String
	},
	state: {
		type: Types.Select,
		options: 'draft, published, archived',
		default: 'draft',
		index: true
	},
	image: {
		type: Types.CloudinaryImage
	},
	imageDescription: {
		type: String
	},
	widget: {
		type: Types.Relationship,
		ref: 'StratumWidget',
		many: false
	},
	content: {
		type: Types.Markdown,
		height: 400,
		toolbarOptions: {
			hiddenButtons: 'H1,H6'
		}
	},
	images: {
		type: Types.CloudinaryImages
	}
});

BasePage.register();
