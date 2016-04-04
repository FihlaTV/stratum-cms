var keystone = require('keystone'),
	Types = keystone.Field.Types,
	BasePage = keystone.list('BasePage');

/**
 * Page Model
 * ==========
 */

var Page = new keystone.List('Page', {
	// sortContext: 'MenuBlock:pages', //sortContext not working properly
	inherits: BasePage,
	defaultColumns: 'title, menu',
	hidden: false,
	nocreate: false,
	nodelete: false
});
Page.add({
	menu: {
		type: Types.Relationship,
		ref: 'MenuBlock',
		many: false,
		filters: { static: false },
		// required: true,
		initial: true
	},
	numberOfSubPages: {
		type: Number,
		dependsOn: {
			contentType: 'default'
		},
		// hidden: true,
		noedit: true,
		default: 0
	}
});
Page.relationship({
	path: 'subPages',
	ref: 'SubPage',
	refPath: 'page'
});
Page.schema.virtual('decreaseSubPages').set(function() {
	this.set('numberOfSubPages', Math.max(0, this.numberOfSubPages - 1));
});
Page.schema.virtual('increaseSubPages').set(function() {
	this.set('numberOfSubPages', this.numberOfSubPages + 1);
});
Page.schema.virtual('hasSubPages').get(function(){
	return this.get('numberOfSubPages') > 0;
});
Page.register();
