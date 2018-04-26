var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Contact Model
 * ==========
 */

var Contact = new keystone.List('Contact', {
	sortable: true,
	track: { createdAt: true, updatedAt: true, updatedBy: true },
});

Contact.add({
	name: { type: Types.Name, required: true, index: true },
	email: { type: Types.Email, initial: true },
	image: {
		type: Types.CloudinaryImage,
		autoCleanup: !keystone.get('is demo'),
	},
	groups: {
		type: Types.Relationship,
		ref: 'ContactGroup',
		initial: true,
		many: true,
	},
	phone: { type: String },
	title: { type: String, label: 'Work Title' },
	note: { type: Types.Textarea, collapse: true },
	showOnContactPage: { type: Boolean },
});

/**
 * Registration
 */

Contact.schema.virtual('description').get(function() {
	return this.get('note') || this.get('title');
});

Contact.defaultColumns = 'name, email, showOnContactPage';
Contact.register();
