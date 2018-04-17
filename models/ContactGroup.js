var keystone = require('keystone');

/**
 * ContactGroup Model
 * ==========
 */

var ContactGroup = new keystone.List('ContactGroup', {
	map: { name: 'group' },
	track: { createdAt: true, updatedAt: true, updatedBy: true },
	sortable: true,
});

ContactGroup.add({
	group: { type: String, required: true, index: true, initial: true },
});

ContactGroup.relationship({
	path: 'contacts',
	ref: 'Contact',
	refPath: 'groups',
});

ContactGroup.register();
