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
	// noedit: true,
	nocreate: true,
	nodelete: true,
	// hidden: true
});

BasePage.add({
	title: {
		type: String,
		required: true
	},
	pageType: { type: String, noedit: true, hidden: true, watch: true, value: function(callback){
		callback(null, this.getValue('__t'));
	}},
	layout: {
		type: Types.Select,
		options: [{
			value: 'standard',
			label: '(Default) Menu and one extra image column on bigger displays'
		}, {
			value: 'wide',
			label: 'Menu and one large column for text on all screens'
		}, {
			value: 'full',
			label: 'Hide menu and use complete page width'
		}],
		default: 'standard'
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
		ref: 'Widget',
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
BasePage.defaultColumns = 'title, pageType|20%';

BasePage.register();
