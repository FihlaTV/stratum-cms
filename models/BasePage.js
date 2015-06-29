var keystone = require('keystone'),
	Types = keystone.Field.Types;

/**
 * Content Page Model
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

//Page
var Page = new keystone.List('Page', {
	// sortContext: 'MenuBlock:pages', //sortContext not working properly
	inherits: BasePage,
	hidden: false,
	nocreate: false,
	nodelete: false
});
Page.add({
	menu: {
		type: Types.Relationship,
		ref: 'MenuBlock',
		many: false,
		required: true,
		initial: true
	}
});
Page.relationship({
	path: 'subPages',
	ref: 'SubPage',
	refPath: 'page'
});
Page.register();

//SubPage
var SubPage = new keystone.List('SubPage', {
	inherits: BasePage,
	hidden: false,
	nocreate: false,
	nodelete: false
});
SubPage.add({
	page: {
		type: Types.Relationship,
		ref: 'Page',
		many: false,
		initial: true,
		required: true
	}
});
SubPage.register();
