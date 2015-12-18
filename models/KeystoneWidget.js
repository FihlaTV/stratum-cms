var keystone = require('keystone'),
	Types = keystone.Field.Types;

/**
 * Keystone Widget Model
 * ==========
 * Represents a widget which is stored in keystone
 * More global widgets made for listing items etc.
 *
 */

var KeystoneWidget = new keystone.List('KeystoneWidget', {
	nocreate: true,
	noedit: true,
	nodelete: true,
	autokey: {
		from: 'name',
		path: 'slug',
		unique: true
	}
});

KeystoneWidget.add({
	name: {
		type: String,
		required: true
	},
	description: {
		type: String
	},
	removed: {
		type: Boolean,
		default: false,
		noedit: true
	}
});
KeystoneWidget.defaultColumns = 'name, description, removed';
KeystoneWidget.defaultSort = 'removed name';

KeystoneWidget.register();
