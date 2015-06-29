var keystone = require('keystone'),
	Types = keystone.Field.Types,
	BasePage = keystone.list('BasePage');

/**
 * Sub Page Model
 * ==========
 */

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
		label: 'Sub Page to',
		note: 'Choose which page this page should be stored under',
		required: true
	}
});
SubPage.register();
