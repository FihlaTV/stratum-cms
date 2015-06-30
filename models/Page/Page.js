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
		// required: true,
		initial: true
	}
});
Page.relationship({
	path: 'subPages',
	ref: 'SubPage',
	refPath: 'page'
});
Page.register();
