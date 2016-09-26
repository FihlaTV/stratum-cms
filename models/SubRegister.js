var keystone = require('keystone');
var	Types = keystone.Field.Types;

/**
 * Sub Register Model
 * ==========
 * Represents a Register in stratum for use in portals
 */

var SubRegister = new keystone.List('SubRegister', {
	sortable: true,
	hidden: !keystone.get('is portal'), // Only visible in portal mode
});

SubRegister.add({
	name: {
		type: String,
		required: true,
		initial: true,
	},
	url: {
		type: Types.Url,
		required: true,
		initial: true,
	},
});

SubRegister.defaultColumns = 'name';

SubRegister.register();
